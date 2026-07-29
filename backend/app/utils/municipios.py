import unicodedata
from typing import List, Optional

MUNICIPIOS_CERCANOS: List[str] = ["bello", "medellin", "itagui", "envigado"]
DEPARTAMENTO_VALIDO: str = "antioquia"

def normalizar_texto(texto: str) -> str:
    """
    Convierte texto a minúsculas, remueve espacios en los extremos y elimina acentos/tildes.
    Ejemplo: 'Itagüí' -> 'itagui', 'Medellín' -> 'medellin', 'Antioquia' -> 'antioquia'
    """
    if not texto:
        return ""
    texto_limpio = texto.strip().lower()
    nfkd_form = unicodedata.normalize('NFD', texto_limpio)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def es_municipio_cercano(municipio: str, departamento: Optional[str] = None) -> bool:
    """
    Determina si un municipio dado pertenece a los municipios cercanos y
    que el departamento sea estrictamente Antioquia.
    """
    if departamento is not None and normalizar_texto(departamento) != DEPARTAMENTO_VALIDO:
        return False
    municipio_normalizado = normalizar_texto(municipio)
    return municipio_normalizado in MUNICIPIOS_CERCANOS
