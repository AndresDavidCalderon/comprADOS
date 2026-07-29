import unicodedata
from typing import List

MUNICIPIOS_CERCANOS: List[str] = ["bello", "medellin", "itagui", "envigado"]

def normalizar_texto(texto: str) -> str:
    """
    Convierte texto a minúsculas, remueve espacios en los extremos y elimina acentos/tildes.
    Ejemplo: 'Itagüí' -> 'itagui', 'Medellín' -> 'medellin'
    """
    if not texto:
        return ""
    texto_limpio = texto.strip().lower()
    # Normalizar Unicode para separar caracteres base de diacríticos y luego eliminarlos
    nfkd_form = unicodedata.normalize('NFD', texto_limpio)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def es_municipio_cercano(municipio: str) -> bool:
    """
    Determina si un municipio dado pertenece a la lista de municipios cercanos.
    """
    municipio_normalizado = normalizar_texto(municipio)
    return municipio_normalizado in MUNICIPIOS_CERCANOS
