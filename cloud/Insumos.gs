/**
 * MÓDULO 1: INSUMOS (Materia Prima)
 */

/**
 * Obtiene todos los insumos calculando su stock en tiempo real
 * Stock = SUMA(INGRESO_INSUMO) - SUMA(CONSUMO_INSUMO)
 */
function obtenerInsumosConStock() {
  const insumos = leerTabla(SHEETS.INSUMO);
  const ingresos = leerTabla(SHEETS.INGRESO_INSUMO);
  const consumos = leerTabla(SHEETS.CONSUMO_INSUMO);
  
  const stockMap = {};
  ingresos.forEach(ing => {
    const id = ing.id_insumo;
    stockMap[id] = (stockMap[id] || 0) + parseFloat(ing.cantidad || 0);
  });
  consumos.forEach(con => {
    const id = con.id_insumo;
    stockMap[id] = (stockMap[id] || 0) - parseFloat(con.cantidad || 0);
  });
  
  return insumos.map(ins => {
    const id = ins.id_insumo;
    const stockActual = Math.max(0, stockMap[id] || 0);
    return {
      id_insumo: id,
      nombre: ins.nombre,
      unidad: ins.unidad,
      costo_promedio: aDecimal(ins.costo_promedio_centavos),
      costo_promedio_centavos: ins.costo_promedio_centavos || 0,
      stock: parseFloat(stockActual.toFixed(3))
    };
  });
}

/**
 * Obtiene el historial de compras filtrado por insumo opcional y con límite de registros
 */
function obtenerHistorialIngresos(idInsumoFiltro, limite) {
  let ingresos = leerTabla(SHEETS.INGRESO_INSUMO);
  if (!ingresos || ingresos.length === 0) return [];

  // Filtro opcional por id_insumo específico
  if (idInsumoFiltro) {
    ingresos = ingresos.filter(ing => ing.id_insumo == idInsumoFiltro);
  }

  const insumos = leerTabla(SHEETS.INSUMO);
  const insumoMap = {};
  insumos.forEach(i => {
    insumoMap[i.id_insumo] = i;
  });

  const tz = Session.getScriptTimeZone();

  const historialCompleto = ingresos.map(ing => {
    const ins = insumoMap[ing.id_insumo];
    const cant = parseFloat(ing.cantidad || 0);
    const costoUnitCentavos = parseInt(ing.costo_unitario_centavos || 0, 10);
    const totalCentavos = Math.round(cant * costoUnitCentavos);

    let fechaStr = ing.fecha;
    if (ing.fecha instanceof Date) {
      fechaStr = Utilities.formatDate(ing.fecha, tz, 'yyyy-MM-dd');
    } else if (typeof ing.fecha === 'string' && ing.fecha.includes('T')) {
      fechaStr = ing.fecha.split('T')[0];
    }

    return {
      id_ingreso: ing.id_ingreso,
      fecha: fechaStr || 'Sin fecha',
      insumo_nombre: ins ? ins.nombre : 'Insumo #' + ing.id_insumo,
      unidad: ins ? ins.unidad : '',
      cantidad: cant,
      costo_unitario: aDecimal(costoUnitCentavos),
      costo_total: aDecimal(totalCentavos)
    };
  }).reverse(); // Compras más recientes primero

  // Aplicar límite por defecto de 10 compras
  const maxRegs = parseInt(limite, 10) || 10;
  return historialCompleto.slice(0, maxRegs);
}

/**
 * Dar de alta un nuevo insumo en la pestaña INSUMO
 */
function crearInsumo(nombre, unidad) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.INSUMO);
  const id = getSiguienteId(SHEETS.INSUMO);
  sheet.appendRow([id, nombre, unidad, 0]);
  return { success: true, id: id, message: `Insumo '${nombre}' creado con éxito.` };
}

/**
 * Registrar compra de insumo y recalcular costo promedio ponderado
 */
function registrarIngresoInsumo(id_insumo, cantidad, costo_unitario, fecha) {
  const cantNum = parseFloat(cantidad);
  const costoUnitCentavos = aCentavos(costo_unitario);
  if (cantNum <= 0) throw new Error('La cantidad ingresada debe ser mayor a 0');
  
  const ss = getSpreadsheet();
  const sheetIngreso = ss.getSheetByName(SHEETS.INGRESO_INSUMO);
  const idIngreso = getSiguienteId(SHEETS.INGRESO_INSUMO);
  const fechaFormat = fecha || new Date().toISOString().split('T')[0];
  
  // 1. Obtener stock previo y costo promedio actual
  const insumosConStock = obtenerInsumosConStock();
  const insumoActual = insumosConStock.find(i => i.id_insumo == id_insumo);
  if (!insumoActual) throw new Error('Insumo no encontrado ID: ' + id_insumo);
  
  const stockPrevio = insumoActual.stock;
  const costoPromPrevioCentavos = insumoActual.costo_promedio_centavos;
  
  // 2. Promedio Ponderado:
  let nuevoCostoPromCentavos = 0;
  const nuevoStockTotal = stockPrevio + cantNum;
  if (nuevoStockTotal > 0) {
    const valorPrevio = stockPrevio * costoPromPrevioCentavos;
    const valorNuevo = cantNum * costoUnitCentavos;
    nuevoCostoPromCentavos = Math.round((valorPrevio + valorNuevo) / nuevoStockTotal);
  }
  
  // 3. Registrar en INGRESO_INSUMO
  sheetIngreso.appendRow([idIngreso, id_insumo, fechaFormat, cantNum, costoUnitCentavos]);
  
  // 4. Actualizar costo_promedio en INSUMO
  const sheetInsumo = ss.getSheetByName(SHEETS.INSUMO);
  const dataInsumo = sheetInsumo.getDataRange().getValues();
  for (let i = 1; i < dataInsumo.length; i++) {
    if (dataInsumo[i][0] == id_insumo) {
      sheetInsumo.getRange(i + 1, 4).setValue(nuevoCostoPromCentavos);
      break;
    }
  }
  
  return {
    success: true,
    id_ingreso: idIngreso,
    nuevo_costo_promedio: aDecimal(nuevoCostoPromCentavos),
    message: 'Compra registrada y costo promedio ponderado actualizado.'
  };
}

/**
 * Actualiza los datos de un insumo (nombre, unidad y costo promedio)
 */
function actualizarInsumo(id_insumo, nombre, unidad, costo_promedio) {
  if (!id_insumo) throw new Error('ID de insumo no especificado');
  if (!nombre || !unidad) throw new Error('Nombre y unidad son obligatorios');

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.INSUMO);
  const data = sheet.getDataRange().getValues();

  let encontrado = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id_insumo) {
      sheet.getRange(i + 1, 2).setValue(nombre);
      sheet.getRange(i + 1, 3).setValue(unidad);
      if (costo_promedio !== undefined && costo_promedio !== null && costo_promedio !== '') {
        const costoCentavos = aCentavos(costo_promedio);
        sheet.getRange(i + 1, 4).setValue(costoCentavos);
      }
      encontrado = true;
      break;
    }
  }

  if (!encontrado) throw new Error('Insumo no encontrado ID: ' + id_insumo);
  return { success: true, message: `Insumo #${id_insumo} ('${nombre}') actualizado con éxito.` };
}

/**
 * Recalcula el costo promedio ponderado de un insumo a partir de todas sus compras registradas
 */
function recalcularCostoPromedioInsumo(id_insumo) {
  const ingresos = leerTabla(SHEETS.INGRESO_INSUMO).filter(ing => ing.id_insumo == id_insumo);
  
  let sumaValorCentavos = 0;
  let sumaCantidad = 0;

  ingresos.forEach(ing => {
    const cant = parseFloat(ing.cantidad || 0);
    const costoUnitCentavos = parseInt(ing.costo_unitario_centavos || 0, 10);
    sumaCantidad += cant;
    sumaValorCentavos += (cant * costoUnitCentavos);
  });

  const nuevoCostoPromCentavos = sumaCantidad > 0 ? Math.round(sumaValorCentavos / sumaCantidad) : 0;

  const ss = getSpreadsheet();
  const sheetInsumo = ss.getSheetByName(SHEETS.INSUMO);
  const dataInsumo = sheetInsumo.getDataRange().getValues();
  for (let i = 1; i < dataInsumo.length; i++) {
    if (dataInsumo[i][0] == id_insumo) {
      sheetInsumo.getRange(i + 1, 4).setValue(nuevoCostoPromCentavos);
      break;
    }
  }

  return nuevoCostoPromCentavos;
}

/**
 * Modifica una compra del historial y recalcula el costo promedio ponderado del insumo
 */
function actualizarIngresoInsumo(id_ingreso, cantidad, costo_unitario) {
  const cantNum = parseFloat(cantidad);
  const costoUnitCentavos = aCentavos(costo_unitario);
  if (cantNum <= 0) throw new Error('La cantidad ingresada debe ser mayor a 0');

  const ss = getSpreadsheet();
  const sheetIngreso = ss.getSheetByName(SHEETS.INGRESO_INSUMO);
  const data = sheetIngreso.getDataRange().getValues();

  let idInsumo = null;
  let encontrado = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id_ingreso) {
      idInsumo = data[i][1];
      sheetIngreso.getRange(i + 1, 4).setValue(cantNum);
      sheetIngreso.getRange(i + 1, 5).setValue(costoUnitCentavos);
      encontrado = true;
      break;
    }
  }

  if (!encontrado) throw new Error('Compra no encontrada ID: ' + id_ingreso);

  // Recalcular el costo promedio ponderado para el insumo afectado
  recalcularCostoPromedioInsumo(idInsumo);

  return {
    success: true,
    message: `Compra #${id_ingreso} actualizada y costo promedio recalculado.`
  };
}

