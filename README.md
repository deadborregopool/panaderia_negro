# 🥖 Sistema de Gestión para Panadería

Bienvenido al repositorio oficial del **Sistema de Gestión de Panadería**. Este proyecto está diseñado con una arquitectura de dominio unificada que permite operar bajo **dos entornos distintos**:

1. **Entorno Cloud (Google Sheets + Google Apps Script)**: Cero costo de servidor, acceso inmediato desde dispositivos móviles y escritorio, y sincronización en tiempo real.
2. **Entorno Local (SQL Server + API + Frontend)**: Sistema interno para operación directa en la PC del local.

---

## 📌 Estado de Desarrollo de Módulos

| Módulo | Descripción | Estado | Entorno Cloud |
| :--- | :--- | :---: | :---: |
| **1. Insumos** | Materia prima, stock dinámico, compras en Soles (`S/`), costo promedio ponderado, historial con filtros y edición de catálogo/compras. | 🟢 Completado | ✅ Operativo |
| **2. Producción** | Horneado por lotes, consumo real de insumos por lote y mano de obra opcional. | 🟡 Pendiente | ⏳ Siguiente fase |
| **3. Ventas Pan** | Ventas de mostrador y pedidos (contado vs fiado) asociando el lote de producción. | 🔴 Pendiente | ⏳ Diseñado en esquema |
| **4. Clientes y Cobros** | Gestión de clientes, fiados y abonos parciales/totales. | 🔴 Pendiente | ⏳ Diseñado en esquema |
| **5. Sobras** | Devoluciones de tienda (mermas/pérdidas) y reuso en producción (tostadas/francés). | 🔴 Pendiente | ⏳ Diseñado en esquema |
| **6. Bodega Comprados** | Productos comprados para revender (gaseosas, lácteos), 100% separados del pan. | 🔴 Pendiente | ⏳ Diseñado en esquema |
| **7. Reportes** | Márgenes reales (`VW_MARGEN_DIA`) e ingresos vs pérdidas (`VW_TIENDA_DIA`). | 🔴 Pendiente | ⏳ Diseñado en esquema |

---

## 📜 Documentación del Repositorio (Para Desarrolladores y Agentes AI)

Para mantener la alineación estricta entre el equipo de desarrollo, colaboradores y asistentes AI:

- [AGENTS.md](AGENTS.md): **Protocolo de trabajo en 3 Fases** (Análisis ➔ Planificación ➔ Ejecución) con aprobación explícita obligatoria.
- [REGISTRO_TABLAS.txt](cloud/REGISTRO_TABLAS.txt): Fuente de verdad de las pestañas de Google Sheets inicializadas, columnas exactas y funciones backend verificadas.
- [DECISIONES_ARQUITECTURA.md](cloud/DECISIONES_ARQUITECTURA.md): Registro de decisiones sobre la moneda oficial (`S/`), costeo por Promedio Ponderado y jerarquía visual de componentes.
- [base_datos_esquema.txt](base_datos_esquema.txt): Especificación completa del modelo de datos de la panadería.
- [panaderia_guia_2entornos.txt](panaderia_guia_2entornos.txt): Guía de arquitectura comparativa entre los entornos Local y Cloud.

---

## 🚀 Despliegue Rápido del Entorno Cloud

### Paso 1: Inicializar la Hoja de Cálculo
1. Creá una hoja de cálculo en blanco en [Google Sheets](https://sheets.google.com).
2. Andá al menú **Extensiones ➔ Apps Script**.

### Paso 2: Copiar el Código Fuente de `cloud/`
Copiá los archivos de la carpeta [cloud/](file:///C:/Programas/Panaderia/cloud/) en tu editor de Apps Script:
- `Config.gs` (Archivos de código)
- `Insumos.gs`
- `WebApp.gs`
- `Index.html` (Archivo HTML)
- `InsumosView.html` (Archivo HTML)

### Paso 3: Publicar la Web App
1. En Apps Script hacé clic en **Implementar ➔ Nueva implementación**.
2. Elegí el tipo **Aplicación web**.
3. Configuración: *Ejecutar como: Yo*, *Quién tiene acceso: Cualquier persona*.
4. Hacé clic en **Implementar** y abrí la URL generada.
