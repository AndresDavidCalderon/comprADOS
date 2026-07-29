export const MUNICIPIOS_CERCANOS = ['bello', 'medellin', 'itagui', 'envigado'];

/**
 * Normaliza un texto convirtiéndolo a minúsculas, quitando espacios extremos y removiendo acentos/tildes.
 * @param {string} texto 
 * @returns {string}
 */
export function normalizarMunicipio(texto) {
  if (!texto) return '';
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Evalúa si el municipio ingresado corresponde estrictamente a uno de los municipios cercanos:
 * Bello, Medellín, Itagüí o Envigado.
 * @param {string} municipio 
 * @returns {boolean}
 */
export function esMunicipioCercano(municipio) {
  const municipioLimpio = normalizarMunicipio(municipio);
  return MUNICIPIOS_CERCANOS.includes(municipioLimpio);
}
