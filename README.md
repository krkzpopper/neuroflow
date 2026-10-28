# Aegis OS | Panel de Control, Auditoría 360° & Alto Rendimiento 🛡️⚖️💼

**Aegis OS** es una plataforma client-side determinista de mando personal y auditoría de salud (sin IA, impulsada por árboles de decisiones y datos duros) concebida para:
1. **Prevención rigurosa de recaídas en alcohol y tabaco** con detección fisiológica en tiempo real, registro de momento exacto y protocolo de emergencia bloqueante.
2. **Rehabilitación articular de rodilla y producción progresiva de BDNF** con criterios cuantitativos para desbloquear parkour y 200m planos.
3. **Optimización del tiempo y flujo financiero determinista** hacia la meta de **$500,000 MXN mensuales libres**.
4. **Sincronización cronobiológica de medicación, nutrición y cognición** en 7 apartados integrados.
5. **Cálculo dinámico de racha de abstinencia:** Contador automático según el calendario local comenzando formalmente el **14 de octubre de 2026**, con selector manual de fecha y sincronización reactiva en tiempo real.

---

## 📊 1. Barra Superior (Header Stats Strip) & Fecha Actual
- **📅 Fecha Actual:** Sincronizada y visible en tiempo real.
- **🛡️ Días de Abstinencia:** Calculados dinámicamente según la fecha de inicio (**14 de octubre de 2026**, avanzando automáticamente cada día) y enlazada de forma reactiva al bloque de craving y al gestor de premios.
- **⚖️ Peso Corporal:** Obtenido en tiempo real desde la báscula inteligente RENPHO o ajuste manual.
- **🌙 Horas de Sueño:** Calculadas por el cronómetro continuo de sueño nocturno.
- **💰 Dinero Recolectado:** Progreso financiero acumulado hacia la meta mensual de **$500,000 MXN libres**.
- **⏱️ Registro Pomodoro:** Ciclos de trabajo enfocado completados en el día (Meta: 8 ciclos / 4 horas).

---

## 🏛️ Resumen de los 7 Módulos

### 1. 🌙 Sueño, Cronobiología & Registro de Craving
- **Meta:** 9 horas de sueño reparador para regeneración neuroquímica y consolidación sináptica de BDNF.
- **Protocolo Horario:**
  - `20:00`: Toma de medicación nocturna (*Valproato, Risperidona, Clonazepam*).
  - `20:30`: Desconexión absoluta de pantallas y a la cama.
  - `21:00`: Inicio del sueño.
  - `06:00`: Despertar matutino e hidratación natural.
- **Cronómetro de Sueño Continuo:**
  - Se activa con un clic al irse a la cama (`🌙 Iniciar Sueño`) y se apaga al despertar (`☀️ Despertar y Apagar Cronómetro`).
  - Persiste el tiempo exacto en `localStorage` (resistente al cierre del navegador o apagado del dispositivo).
  - Alimenta de forma automática el historial de los últimos 7 días.
- **Contenedor 1: Impacto en Neuroquímica & Craving + Historial 7 Días:**
  - Diagnóstico determinista de BDNF hipocampal, ondas lentas N3/REM y control inhibitorio de la corteza prefrontal.
  - Almacén de los últimos 7 días con horas reales, calidad y certificación del protocolo.
- **Contenedor 2: Registro de Craving (Alcohol & Tabaco) & Contador de Abstinencia:**
  - **Contador Dinámico de Días de Abstinencia:** Visualización en tiempo real calculada automáticamente mediante la diferencia de días entre la fecha de inicio (**14 de octubre de 2026**) y el calendario actual (avanza solo conforme pasan los días).
  - **Selector y Ajuste de Fecha de Inicio:** Permite visualizar y ajustar la fecha de inicio en cualquier momento con un selector de fecha y botón "🔄 Ajustar Fecha", recalculando al instante la racha.
  - **Botón de Reincidencia:** Si se vuelve a tomar o fumar, al confirmar se reinicia el contador inmediatamente a **Día 0**, se actualiza la fecha de reinicio al momento exacto y se registra en la auditoría permanente. Sincronizado en tiempo real con el Header y el Gestor de Premios.
  - **Slider de Craving de Alcohol (1 al 5):** Desde 1 (Ninguno / Mente clara) hasta 5 (Crítico / Riesgo inminente).
  - **Slider de Craving de Fumar (1 al 5):** Escala del 1 al 5 con descriptores dinámicos en tiempo real.
  - **Botón "Registrar Momento Exacto del Registro":** Guarda la fecha y hora exacta (`timestamp`), detonante identificado y aplica un dictamen determinista inmediato (hidratación helada, semillas de calabaza, respiración 4-7-8 o disparo del protocolo de emergencia si $\ge 4$).
  - **Historial de Craving:** Tabla con los registros cronológicos y acciones tomadas.

### 2. 💰 Contabilidad (5 Cubetas de Flujo & Libro Mayor)
- **Saldos Limpios desde $0.00:** Inicio en ceros reales y botón "Reiniciar a $0".
- **Clasificación de Ingresos:** Selección obligatoria entre `Ingeniería`, `Pedagogía`, `Servicio técnico` o `Agrícola`.
- **Partición Automática Determinista:**
  - **40% Gastos Operativos Diarios:** Destinado a comida del día y pasajes. Se divide entre 7 para fijar el presupuesto diario en efectivo. *Regla estricta:* Prohibido tomar fondos de otras cubetas.
  - **20% Mantenimiento Semanal:** Despensa por volumen e insumos del hogar.
  - **20% Costos Mensuales:** Fondo intocable para medicamentos, servicios y salud.
  - **10% Inversión y Liquidación de Deuda:** Capital semilla para proyectos probados y amortización de deudas.
  - **10% Premios (Interruptor Lógico):** Fondo condicionado a metas reales.
- **Formularios de Gastos:**
  - *Diario:* Nombre, monto, lugar de compra y categoría (`Personal`, `Producción`, `Comercial`, `Empresarial`).
  - *Semanal:* Nombre, monto, lugar de compra y categoría (`Comida`, `Higiene`).
  - *Mensual:* Nombre, monto, lugar de compra y categoría (`Medicamentos`, `Ropa`, `Salud`).
- **Proyectos de Inversión con Desglose Editable:**
  - Formulario con desglose de insumos o componentes (nombre y precio individual).
  - Costo total calculado automáticamente a partir de la suma de los componentes.
  - Selector de estatus: `en espera`, `en proceso` o `terminado`.
  - Tarjetas clickeables para abrir el modal de edición, añadir nuevos insumos, modificar precios o eliminar el proyecto.
- **Gestor de Premios con Interruptor Lógico Auditado:**
  - Despliega todas las metas en formato de fila (`flex-direction: row`): (1) Tiempo sobrio (del contador de abstinencia), (2) Meta de peso ($\le$ kg de la báscula), (3) Saldo suficiente en Cubeta 5 ($), y (4) Fecha límite vigente.
  - **Cobro y Retiro:** Al cumplirse todas las metas reales, se habilita el cobro; una vez cobrado, el apartado del premio se borra automáticamente.
  - **Penalización Determinista y Retiro:** Si se declara incumplimiento o fallo, los fondos se transfieren automáticamente a la Cubeta de Inversión y Deuda, y el apartado del premio se borra de la vista.
- **Libro Mayor de los Últimos 7 Días:** Tabla cronológica auditable con hora y fecha de la transacción, si fue ingreso o egreso, categoría, descripción, cubeta afectada y monto.
- **Historial Diario de Registros (Desde el 15 de Octubre de 2026):** Tabla auditable permanente que conserva la memoria de cada día (fecha, racha de abstinencia, peso de báscula, horas de sueño, cumplimiento de protocolo 20:30-06:00, cronograma de comidas, bloques de medicación y pomodoros), con reinicio automático de checklists en medianoche o mediante botón "🔄 Cerrar Día / Nuevo Día".

### 3. 🥗 Nutrición, Despensa de Otzolotepec & Mifflin-St. Jeor
- **Báscula RENPHO (scale.js):** Conexión Web Bluetooth con driver para protocolos múltiples (QN-Scale, LeFu/Chipsea 55AA, SIG), sonido chime de fijación y modales informativos corregidos.
- **Fórmula de Mifflin - St. Jeor:** Distribución calórica estricta: **50% Carbohidratos**, **25% Proteínas**, **25% Grasas Saludables**, sincronizada con el factor de actividad física del bloque de ejercicio.
- **Lista Semanal Dominical de Otzolotepec:** Generador de compras priorizando alimentos de temporada económicos que reducen grasa visceral y colesterol LDL mientras aumentan masa muscular (nopales tiernos, calabacitas criollas, quelites/espinacas, pechuga de granja, huevos de rancho, aguacate criollo, avena integral, semillas de calabaza y manzana perón). Botón para integrarla en 1 clic a la despensa y Cubeta 2.
- **Comparador Precio / Calidad Biológica:** Evalúa nutrientes clave contra el precio de mercado para determinar la mejor compra económica y nutritiva.
- **Cronograma de Comidas y Medicación:**
  - `07:00`: Agua natural + Medicación matutina (*Lisdexanfetamina, Bupropión, Sertralina, Valproato, Risperidona*).
  - `07:30`: Desayuno proteico (sin jugos cítricos ni harinas refinadas para evitar interferencia de pH y picos de insulina).
  - `11:00`: Snack vegetal crujiente o 15g semillas de calabaza.
  - `13:00`: Almuerzo balanceado + **Toma de Sertralina y Bupropión** con alimentos para evitar irritación gástrica.
  - `16:00`: Toma de Alprazolam + Snack de rescate (manzana con canela / infusión caliente; **cero toronja** por inhibición de CYP3A4).
  - `18:30`: Cena digestiva ligera (pescado al vapor o claras con nopales/calabazas).
  - `20:00`: Medicación nocturna (*Valproato, Risperidona, Clonazepam*).
- **Checklist y Monitor de Hambre:** Registro con hora exacta, tipo (fisiológico vs craving) y sugerencia saciante determinista.

### 4. 💊 Medicación & Farmacocinética ("Barra de Vida")
- **Curva Farmacocinética Individualizada:** Cálculo de concentración plasmática activa ajustada por peso, edad y sexo biológico del paciente.
- **CRUD Completo de Medicamentos:**
  - Botón **"+ Medicamento"** para dar de alta nuevos fármacos indicando nombre, dosis, bloque horario, $T_{\max}$, $t_{1/2}$ y función terapéutica.
  - Botón de edición (✏️) en cada medicamento para modificar dosis, horarios o parámetros cinéticos.
  - Botón de eliminación (🗑️) con confirmación previa.
  - Agrupación por bloques horarios: `07:00`, `13:00`, `16:00` y `20:00`.
- **Aprovechamiento de Picos:** Sincronización del pico dopaminérgico de Lisdexanfetamina (09:30 - 13:30) para las tareas de mayor exigencia mental en programación y estudio.

### 5. 🏃 Ejercicio, Rodilla & Estimulación de BDNF
- **Protocolo de 15 Minutos:** Ejercicios isométricos articulares seguros para la rodilla (Wall-sit 45°, elevaciones de pierna recta, puentes de glúteo, curl femoral y marcha) orientados a secretar BDNF y mitigar efectos metabólicos de fármacos.
- **Desbloqueo Determinista de Parkour y 200m Planos:** Criterios cuantitativos estrictos:
  1. Peso $\le 75.0$ kg.
  2. 30 días consecutivos con dolor de rodilla en 0/10.
  3. 25 sesiones completadas de la Fase 1.

### 6. 💼 Trabajo (Pomodoro 8x25m) & Proyectos Productivos
- **8 Ciclos Pomodoro (4 horas netas):** Pausas de 5 minutos con cuestionario obligatorio (Ansiedad, Concentración, Hambre y Deseo de Alcohol).
- **Protocolo de Choque Anti-Recaída:** Si el deseo de alcohol es $\ge 3$ o la ansiedad es $\ge 4$, el sistema entra en paro preventivo y activa respiración 4-7-8 y reorientación vagal.
- **Los 7 Emprendimientos:**
  1. *App de Seguimiento:* Auditoría psicofisiológica continua.
  2. *POS Tienda Don Pale:* Terminal de cobro, centro de pruebas de **Moneda Virtual Pale (MVP)**, analítica de productos más vendidos y recomendación determinista para invertir el crédito de tarjeta en insumos de alta rotación (huevos y abarrotes básicos).
  3. *Gallinas Ponedoras:* 10 gallinas y 1 gallo para vender huevo e incubar.
  4. *Gallos para Carne:* Sacrificio a las 18 semanas para canal o procesamiento (nuggets, carne molida, salchichas de pollo).
  5. *Incubadora Automática:* Tasa alta de eclosión, orientada a ranchos avícolas y gallos de pelea.
  6. *Composta Térmica:* Separación de residuos orgánicos para alimentar la lombricomposta tras romper fibras del pasto.
  7. *Lombricomposta:* Lombriz roja californiana para humus y proteína viva para gallinas.

### 7. 📚 Estudio Estratégico (4 Horas / 6 Ramas)
Cronometraje y acumulación de horas en:
1. Maestría en Ciencias (Biología, Física, Matemáticas).
2. Doctorado en Neuroingeniería (Alemania / BCI).
3. Inglés C1/C2 académico.
4. Alemán B2/C1.
5. Música de Órgano (Polifonía y pedalero).
6. Teología & Metafísica Tomista.

---

## 🚀 Puesta en Marcha

Ejecuta directamente en tu navegador Google Chrome o Microsoft Edge (requerido para compatibilidad con Web Bluetooth):
```bash
open /Users/jescalante/.gemini/antigravity/scratch/nutri-smart-scale/index.html
```

O inicia un servidor HTTP local:
```bash
cd /Users/jescalante/.gemini/antigravity/scratch/nutri-smart-scale
python3 -m http.server 8080
```
Y abre `http://localhost:8080`.
