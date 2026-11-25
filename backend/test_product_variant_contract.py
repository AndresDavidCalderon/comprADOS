from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.routes.productos import (
    Product,
    ProductVariant,
    _normalized_variants,
    _validate_product_input,
)


def test_variant_contract_ignores_quantity_override():
    variant_data = _normalized_variants([{
        "variant_type": "Rojo",
        "quantity": 3,
        "quantity_override": False,
        "photos": [],
        "is_showcase": True,
    }])[0]

    variant = ProductVariant(
        variant_type=variant_data["variant_type"],
        quantity=variant_data["quantity"],
        photos=variant_data["photos"],
        is_showcase=variant_data["is_showcase"],
        description_override=None,
        price_override=None,
        materials_override=None,
    )
    serialized = variant.to_dict(SimpleNamespace(
        description="Descripción base",
        price=1200,
        materials=[],
    ))

    assert variant_data["quantity"] == 3
    assert "quantity_override" not in variant_data
    assert serialized["quantity"] == 3
    assert "quantity_override" not in serialized
    assert "description" not in serialized

    other_variant = ProductVariant(
        variant_type="Azul",
        quantity=5,
        photos=[],
        is_showcase=False,
        description_override=None,
        price_override=None,
        materials_override=None,
    )
    product = Product(
        name="Producto",
        description="Descripción base",
        price=1200,
        category="collares",
        materials=[],
        is_hidden=False,
        tags=[],
        variants=[other_variant, variant],
    )
    product_data = product.to_dict()

    assert product_data["quantity"] == 8
    assert product_data["showcase_variant"] == 1
    assert all("quantity_override" not in item for item in product_data["variants"])
    assert all("description" not in item for item in product_data["variants"])


def test_color_data_is_kept_only_for_color_variants():
    color_data = {"example": ["arbitrary", "JSON"]}
    color_variants = _normalized_variants([
        {"variant_type": "#ff0000", "color_data": color_data},
        {"variant_type": "#0000ff"},
    ], "color")
    named_variants = _normalized_variants([
        {"variant_type": "Rojo", "color_data": color_data},
        {"variant_type": "Azul"},
    ], "name")

    assert color_variants[0]["color_data"] == color_data
    assert color_variants[1]["color_data"] is None
    assert all(variant["color_data"] is None for variant in named_variants)

    variant = ProductVariant(
        variant_type="#ff0000",
        quantity=1,
        photos=[],
        color_data=color_data,
        is_showcase=True,
    )
    serialized = variant.to_dict(SimpleNamespace(price=1200, materials=[]))
    assert serialized["color_data"] == color_data


def test_product_input_validation_returns_422_with_missing_field_location():
    with pytest.raises(HTTPException) as error:
        _validate_product_input({"name": "Collar"})

    assert error.value.status_code == 422
    assert any(
        detail["loc"] == ("body", "producto", "description")
        for detail in error.value.detail
    )


def test_product_input_validation_rejects_invalid_nested_variant():
    with pytest.raises(HTTPException) as error:
        _validate_product_input({
            "name": "Collar",
            "description": "Descripción",
            "price": 80000,
            "category": "collares",
            "variants": [{"variant_type": "Única", "quantity": -1}],
        })

    assert error.value.status_code == 422
    assert any(
        detail["loc"] == ("body", "producto", "variants", 0, "quantity")
        for detail in error.value.detail
    )


def test_product_input_accepts_editor_variant_payload():
    product = _validate_product_input({
        "name": "Collar",
        "description": "Descripción",
        "price": 80000,
        "category": "collares",
        "materials": [],
        "tags": [],
        "is_hidden": False,
        "variant_kind": "color",
        "variants": [{
            "id": 12,
            "product_id": 5,
            "variant_type": "#ff0000",
            "quantity": 2,
            "photos": ["https://example.test/photo.jpg"],
            "description_override": None,
            "price_override": None,
            "materials_override": None,
            "color_data": None,
            "is_showcase": True,
            "price": 80000,
            "materials": [],
        }],
    })

    assert product.variants[0].id == 12
    assert product.variants[0].product_id == 5


def test_product_input_rejects_non_json_color_data():
    with pytest.raises(HTTPException) as error:
        _validate_product_input({
            "name": "Collar",
            "description": "Descripción",
            "price": 80000,
            "category": "collares",
            "variants": [{"color_data": float("nan")}],
        })

    assert error.value.status_code == 422
    assert any(
        detail["loc"] == ("body", "producto", "variants", 0, "color_data")
        for detail in error.value.detail
    )
