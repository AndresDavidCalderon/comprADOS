import pytest
from app.utils.municipios import es_municipio_cercano, normalizar_texto

def test_normalizacion():
    assert normalizar_texto("Medellín") == "medellin"
    assert normalizar_texto("Itagüí") == "itagui"
    assert normalizar_texto("  BELLO ") == "bello"
    assert normalizar_texto("Envigado") == "envigado"

def test_municipios_cercanos():
    # Nearby municipalities
    assert es_municipio_cercano("Bello") is True
    assert es_municipio_cercano("Medellín") is True
    assert es_municipio_cercano("medellin") is True
    assert es_municipio_cercano("Itagüí") is True
    assert es_municipio_cercano("ITAGUI") is True
    assert es_municipio_cercano("Envigado") is True

    # Far municipalities
    assert es_municipio_cercano("Bogotá") is False
    assert es_municipio_cercano("Río Negro") is False
    assert es_municipio_cercano("Cali") is False
    assert es_municipio_cercano("Sabaneta") is False

if __name__ == "__main__":
    test_normalizacion()
    test_municipios_cercanos()
    print("[SUCCESS] All US07 backend municipality classification tests passed successfully!")
