/**
 * CONTROLADOR WEB APP - ESTRUCTURA MODULAR
 */

function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Sistema Panadería Cloud')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function apiCall(action, payload) {
  try {
    switch (action) {
      case 'obtenerInsumos':
        return { success: true, data: obtenerInsumosConStock() };

      case 'obtenerHistorialIngresos':
        return {
          success: true,
          data: obtenerHistorialIngresos(
            payload ? payload.id_insumo : null,
            payload ? payload.limite : 10
          )
        };

      case 'crearInsumo':
        return crearInsumo(payload.nombre, payload.unidad);

      case 'registrarIngresoInsumo':
        return registrarIngresoInsumo(
          payload.id_insumo,
          payload.cantidad,
          payload.costo_unitario,
          payload.fecha
        );

      default:
        throw new Error('Acción no válida: ' + action);
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}
