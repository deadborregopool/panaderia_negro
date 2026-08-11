# 🚨 Reglas Strict de Trabajo y Workflow de Desarrollo

## 🛑 REGLA DE ORO: CICLO DE 3 PASOS CON APROBACIÓN OBLIGATORIA

Para cualquier tarea, cambio o módulo nuevo, el asistente DEBE seguir estrictamente estas 3 fases en mensajes separados, ESPERANDO la aprobación explícita del usuario entre cada una:

### FASE 1: ANÁLISIS
1. Presentar únicamente el **Análisis del problema/requerimiento** (reglas de negocio, implicancias de dominio, casos de uso).
2. **PARAR INMEDIATAMENTE (STOP)** y hacer 1 sola pregunta al usuario pidiendo su validación/aprobación sobre el análisis.
3. NO escribir ningún código, ni presentar planes de archivos hasta que el usuario diga "Aprobado" o dé su feedback.

### FASE 2: PLANIFICACIÓN
1. Solo cuando la Fase 1 esté aprobada por el usuario, presentar el **Plan detallado** (archivos a modificar, esquema de interfaz, funciones a crear).
2. **PARAR INMEDIATAMENTE (STOP)** y pedir la aprobación del usuario sobre el plan.
3. NO modificar ni escribir archivos locales hasta que el usuario apruebe el plan.

### FASE 3: EJECUCIÓN Y PRUEBA
1. Solo cuando la Fase 2 esté aprobada, escribir los cambios en los archivos locales.
2. Guiar al usuario paso a paso para la verificación/prueba.
