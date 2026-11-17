from types import SimpleNamespace

from app.routes.productos import Product, ProductVariant, _normalized_variants


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
