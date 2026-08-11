# 📜 Registro de Decisiones de Arquitectura - Panadería Cloud

Este archivo sirve de contexto de verdad para el repositorio GitHub y para sincronizar a los desarrolladores y agentes AI del equipo.

---

## 🇵🇪 1. Moneda Oficial
- **Moneda**: Soles Peruanos (`S/`).
- **Persistencia**: Todos los valores monetarios se almacenan como **céntimos enteros** (`int`) en Google Sheets para evitar errores de precisión por coma flotante (IEEE 754).
- **Presentación**: La interfaz convierte los céntimos a decimales mostrando el símbolo `S/`.

---

## 🧮 2. Modelo Financiero y Costeo de Materias Primas
- **Método**: **Costo Promedio Ponderado** (*Weighted Average Cost*).
- **Regla**: Cada compra registrada en `INGRESO_INSUMO` recalcula el `costo_promedio_centavos` del insumo en la tabla `INSUMO`:

$$\text{Nuevo Costo Promedio} = \frac{(\text{Stock Previo} \times \text{Costo Promedio Previo}) + (\text{Cant. Comprada} \times \text{Costo Unit. Compra})}{\text{Stock Previo} + \text{Cant. Comprada}}$$

- **Auditoría**: Se mantiene la tabla `INGRESO_INSUMO` como historial inmutable de compras para auditar en cualquier momento de dónde proviene la variación del costo promedio.

---

## 📱 3. Jerarquía Visual del Módulo de Insumos (`InsumosView.html`)
1. **Stock e Inventario Actual**: Vista principal con cálculo dinámico de stock en tiempo real (`SUM(Ingresos) - SUM(Consumos)`).
2. **Registrar Compra**: Formulario rápido para ingresar materias primas con el precio del día en Soles.
3. **Historial de Compras Recientes**: Tabla de auditoría mostrando compras anteriores (fecha, cantidad, precio unitario y costo total).
4. **Catálogo / Crear Insumo**: Formulario desplegable (oculto por defecto mediante botón "➕ Nuevo Insumo") para no saturar la vista operativa.
