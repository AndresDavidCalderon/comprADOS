import pytest
from app.utils.municipios import es_municipio_cercano, normalizar_texto

def test_normalizacion():
    assert normalizar_texto("Medellín") == "medellin"
    assert normalizar_texto("Itagüí") == "itagui"
    assert normalizar_texto("  BELLO ") == "bello"
    assert normalizar_texto("Envigado") == "envigado"
    assert normalizar_texto("Antioquia") == "antioquia"

def test_municipios_cercanos():
    # Nearby municipalities with Antioquia or default
    assert es_municipio_cercano("Bello", "Antioquia") is True
    assert es_municipio_cercano("Medellín", "antioquia") is True
    assert es_municipio_cercano("medellin", "ANTIOQUIA") is True
    assert es_municipio_cercano("Itagüí", "Antioquia") is True
    assert es_municipio_cercano("ITAGUI", "Antioquia") is True
    assert es_municipio_cercano("Envigado", "Antioquia") is True

    # Far municipalities or non-Antioquia departments
    assert es_municipio_cercano("Bello", "Cundinamarca") is False
    assert es_municipio_cercano("Medellín", "Valle del Cauca") is False
    assert es_municipio_cercano("Bogotá", "Cundinamarca") is False
    assert es_municipio_cercano("Río Negro", "Antioquia") is False
    assert es_municipio_cercano("Cali", "Valle") is False
    assert es_municipio_cercano("Sabaneta", "Antioquia") is False

if __name__ == "__main__":
    test_normalizacion()
    test_municipios_cercanos()
    print("[SUCCESS] All US07 backend municipality classification tests passed successfully!")
