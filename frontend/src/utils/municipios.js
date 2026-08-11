export const MUNICIPIOS_CERCANOS = ['bello', 'medellin', 'itagui', 'envigado'];
export const DEPARTAMENTO_VALIDO = 'antioquia';

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
 * Evalúa si el municipio ingresado corresponde estrictamente a uno de los municipios cercanos
 * (Bello, Medellín, Itagüí o Envigado) Y si el departamento ingresado es Antioquia.
 * @param {string} municipio 
 * @param {string} [departamento]
 * @returns {boolean}
 */
export function esMunicipioCercano(municipio, departamento) {
  if (departamento !== undefined && normalizarMunicipio(departamento) !== DEPARTAMENTO_VALIDO) {
    return false;
  }
  const municipioLimpio = normalizarMunicipio(municipio);
  return MUNICIPIOS_CERCANOS.includes(municipioLimpio);
}
