/**
 * INFRAESTRUCTURA BASE Y CONFIGURACIÓN
 * Entorno Cloud: Google Sheets + Apps Script (Vinculado por Extensiones)
 */

// Pestañas relativas a Insumos
const SHEETS = {
  INSUMO: 'INSUMO',
  INGRESO_INSUMO: 'INGRESO_INSUMO',
  CONSUMO_INSUMO: 'CONSUMO_INSUMO'
};

// Encabezados de tablas para Insumos
const SCHEMAS = {
  INSUMO: ['id_insumo', 'nombre', 'unidad', 'costo_promedio_centavos'],
  INGRESO_INSUMO: ['id_ingreso', 'id_insumo', 'fecha', 'cantidad', 'costo_unitario_centavos'],
  CONSUMO_INSUMO: ['id_consumo', 'id_produccion', 'id_insumo', 'cantidad']
};

/**
 * Acceso seguro a la planilla vinculada
 */
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Inicializa las pestañas de insumos en Google Sheets
 */
function inicializarBaseDatos() {
  const ss = getSpreadsheet();
  
  Object.keys(SCHEMAS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SCHEMAS[sheetName]);
      sheet.getRange(1, 1, 1, SCHEMAS[sheetName].length).setFontWeight('bold');
    }
  });

  return { success: true, message: 'Pestañas de Insumos inicializadas con éxito.' };
}

/**
 * Dinero en céntimos enteros (evita flotantes IEEE 754)
 */
function aCentavos(monto) {
  if (monto === null || monto === undefined || monto === '') return 0;
  return Math.round(parseFloat(monto) * 100);
}

function aDecimal(centavos) {
  if (centavos === null || centavos === undefined || centavos === '') return 0;
  return (parseInt(centavos, 10) / 100).toFixed(2);
}

/**
 * Genera el siguiente ID autoincremental de una pestaña
 */
function getSiguienteId(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Pestaña no encontrada: ' + sheetName);
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1;
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let maxId = 0;
  for (let i = 0; i < ids.length; i++) {
    const val = parseInt(ids[i][0], 10);
    if (!isNaN(val) && val > maxId) maxId = val;
  }
  return maxId + 1;
}

/**
 * Lee una pestaña y devuelve array de objetos por encabezado
 */
function leerTabla(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];
  
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  return data.map(row => {
    const item = {};
    headers.forEach((h, colIdx) => {
      item[h] = row[colIdx];
    });
    return item;
  });
}
