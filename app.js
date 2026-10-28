/**
 * Aegis OS - Sistema Central de Auditoría, Salud & Alto Rendimiento
 * Operación mediante lógica determinista (árbol de decisiones) sin IA.
 */

// =============================================================================
// 1. ESTADO GLOBAL & PERSISTENCIA (LOCALSTORAGE)
// =============================================================================

const DEFAULT_STATE = {
  currentDate: '2026-10-19',
  lastActiveDate: '2026-10-19',
  sobrietyStartDate: '2026-10-14',
  sobrietyDays: 6, // Comenzando el 14 de octubre de 2026 (Día 6 al 19 de octubre)
  dailyRecords: [
    {
      date: '15/10/2026',
      isoDate: '2026-10-15',
      sobrietyDay: 2,
      weight: 74.5,
      sleepHours: 9.0,
      sleepProtocol: true,
      mealsCount: 7,
      medBlocksCount: 4,
      pomodoroCycles: 8,
      cravingMax: 1,
      notes: 'Inicio formal de auditoría determinista.'
    },
    {
      date: '16/10/2026',
      isoDate: '2026-10-16',
      sobrietyDay: 3,
      weight: 74.4,
      sleepHours: 8.8,
      sleepProtocol: true,
      mealsCount: 7,
      medBlocksCount: 4,
      pomodoroCycles: 8,
      cravingMax: 1,
      notes: 'Protocolo neuroquímico y BDNF cumplido.'
    },
    {
      date: '17/10/2026',
      isoDate: '2026-10-17',
      sobrietyDay: 4,
      weight: 74.2,
      sleepHours: 9.0,
      sleepProtocol: true,
      mealsCount: 7,
      medBlocksCount: 4,
      pomodoroCycles: 8,
      cravingMax: 2,
      notes: 'Control vagal exitoso post-ejercicio.'
    },
    {
      date: '18/10/2026',
      isoDate: '2026-10-18',
      sobrietyDay: 5,
      weight: 74.0,
      sleepHours: 9.2,
      sleepProtocol: true,
      mealsCount: 7,
      medBlocksCount: 4,
      pomodoroCycles: 8,
      cravingMax: 1,
      notes: 'Despensa dominical y preparación semanal.'
    }
  ],
  abstinence: {
    startDate: '2026-10-14',
    days: 6,
    alcoholCraving: 1,
    smokeCraving: 1,
    cravingHistory: [],
    relapses: []
  },
  userProfile: {
    name: 'Usuario Principal',
    birthdate: '1996-05-15',
    height: 175,
    gender: 'male',
    activityFactor: 1.2,
    weight: 74.5
  },
  weightHistory: [
    { date: '15/10/2026', weight: 74.5 }
  ],
  sleep: {
    targetHours: 9,
    sleepTimerRunning: false,
    sleepStartTime: null,
    actualHours: 9.0,
    quality: 5,
    protocolAccomplished: true,
    nightMedChecked: false,
    screensOffChecked: false,
    history: [
      { date: '15/10/2026', hours: 9.0, quality: 5, protocol: true }
    ]
  },
  accounting: {
    monthlyGoal: 500000,
    currentMonthIncome: 0, // Inicia estrictamente en 0 pesos
    buckets: {
      b1_daily: 0,     // 40%
      b2_weekly: 0,    // 20%
      b3_monthly: 0,   // 20%
      b4_invest: 0,    // 10%
      b5_rewards: 0    // 10%
    },
    ledger: [],        // Libro mayor determinista
    expensesDaily: [],
    expensesWeekly: [],
    expensesMonthly: [],
    investmentProjects: [
      {
        id: 'inv1',
        name: 'Insumos de Abarrotes Tienda Don Pale',
        status: 'en proceso',
        returnTime: '3 semanas',
        components: [
          { id: 'c1', name: 'Cajas de huevo de rancho', price: 4500 },
          { id: 'c2', name: 'Abarrotes y legumbres mayoreo', price: 7500 }
        ],
        totalCost: 12000
      },
      {
        id: 'inv2',
        name: 'Componentes Electrónicos para Incubadoras',
        status: 'en espera',
        returnTime: '1 mes',
        components: [
          { id: 'c3', name: 'Controladores termostato STC-1000', price: 3200 },
          { id: 'c4', name: 'Sensores de humedad e higrómetros', price: 1800 },
          { id: 'c5', name: 'Ventiladores 12V y resistencias térmicas', price: 3500 }
        ],
        totalCost: 8500
      }
    ],
    rewards: [
      {
        id: 'rew1',
        name: 'Audífonos de Estudio con Aislamiento Acústico',
        soberDays: 30,
        weightTarget: 74.0,
        money: 2500,
        deadline: '2026-11-15',
        status: 'pending'
      }
    ]
  },
  nutrition: {
    hungerHistoryToday: [],
    pantryInventory: [
      { id: 'pi1', name: 'Calabacitas criollas Otzolotepec', qty: 1.5, unit: 'kg', price: 27, cat: 'veg', dailyPortion: '215g/día' },
      { id: 'pi2', name: 'Zanahoria fresca de milpa', qty: 1.0, unit: 'kg', price: 18, cat: 'veg', dailyPortion: '140g/día' },
      { id: 'pi3', name: 'Nopales tiernos locales', qty: 1.2, unit: 'kg', price: 20, cat: 'veg', dailyPortion: '170g/día' },
      { id: 'pi4', name: 'Pechuga de pollo fresca', qty: 1.4, unit: 'kg', price: 160, cat: 'protein', dailyPortion: '200g/día' },
      { id: 'pi5', name: 'Avena integral en hojuelas', qty: 0.5, unit: 'kg', price: 18, cat: 'carb', dailyPortion: '40g/día' },
      { id: 'pi6', name: 'Huevos de rancho orgánicos', qty: 18, unit: 'pz', price: 75, cat: 'protein', dailyPortion: '2-3 pz/día' },
      { id: 'pi7', name: 'Aguacate Hass', qty: 0.8, unit: 'kg', price: 65, cat: 'fat', dailyPortion: '1/4 pz/día' },
      { id: 'pi8', name: 'Manzanas perón criollas', qty: 1.0, unit: 'kg', price: 32, cat: 'fruit', dailyPortion: '1 pz/día' }
    ],
    mealSchedule: [
      { time: '07:00', title: 'Agua Natural & Medicación Matutina', desc: '1 vaso grande de agua (350ml) + Lisdexanfetamina, Bupropión, Sertralina, Valproato, Risperidona.', consumed: false, consumedTime: '' },
      { time: '07:30', title: 'Desayuno Neuro-Protector', desc: 'Huevos o claras con verduras abundantes (espinacas/tomate), 1/4 aguacate y 1/3 taza avena integral. Evita jugos y harinas refinadas para evitar desplomes de glucosa a media mañana.', consumed: false, consumedTime: '' },
      { time: '11:00', title: 'Snack Saciante & Hidratación', desc: '1 vaso grande de agua natural y bastones de verdura crujiente o 15g de semillas de calabaza (zinc, magnesio y triptófano).', consumed: false, consumedTime: '' },
      { time: '13:00', title: 'Almuerzo Balanceado & Medicación', desc: 'Mitad de plato de vegetales cocidos o ensalada fresca (calabaza, lechuga, cebolla). Porción de pechuga o pescado, y una porción pequeña de legumbres o arroz integral. Tomar medicamento (Sertralina, Bupropion).', consumed: false, consumedTime: '' },
      { time: '16:00', title: 'Alprazolam & Snack de Rescate', desc: 'Toma de Alprazolam. Snack de rescate: Manzana en rebanadas con canela o infusión caliente. Cero toronja.', consumed: false, consumedTime: '' },
      { time: '18:30', title: 'Cena Digestiva Ligera', desc: 'Pescado al vapor o claras de huevo con calabazas o nopales asados.', consumed: false, consumedTime: '' },
      { time: '20:00', title: 'Medicación Nocturna', desc: 'Valproato, Risperidona, Clonazepam con medio vaso de agua tibia.', consumed: false, consumedTime: '' }
    ]
  },
  medication: {
    medsList: [
      { id: 'm1', name: 'Lisdexanfetamina', dose: '50mg', timeBlock: '07:00', tmax: 3.5, halflife: 11, role: 'Enfoque dopaminérgico / TDAH' },
      { id: 'm2', name: 'Bupropión', dose: '150mg', timeBlock: '07:00', tmax: 3.0, halflife: 14, role: 'Antidepresivo dopamina/NA matutino' },
      { id: 'm_sert_am', name: 'Sertralina', dose: '50mg', timeBlock: '07:00', tmax: 6.0, halflife: 26, role: 'ISRS serotonina matutina' },
      { id: 'm3', name: 'Ácido Valproico', dose: '500mg', timeBlock: '07:00', tmax: 3.0, halflife: 15, role: 'Estabilizador / GABA matutino' },
      { id: 'm4', name: 'Risperidona', dose: '1mg', timeBlock: '07:00', tmax: 1.5, halflife: 20, role: 'Antipsicótico / Bloqueo D2 matutino' },
      { id: 'm5', name: 'Sertralina (Almuerzo)', dose: '50mg', timeBlock: '13:00', tmax: 6.0, halflife: 26, role: 'ISRS serotonina (con almuerzo)' },
      { id: 'm6', name: 'Bupropión (Refuerzo)', dose: '150mg', timeBlock: '13:00', tmax: 3.0, halflife: 14, role: 'Tono noradrenérgico vespertino' },
      { id: 'm7', name: 'Alprazolam', dose: '0.25mg', timeBlock: '16:00', tmax: 1.5, halflife: 11, role: 'Ansiolítico de rescate' },
      { id: 'm8', name: 'Ácido Valproico (Noche)', dose: '500mg', timeBlock: '20:00', tmax: 3.0, halflife: 15, role: 'Estabilizador nocturno' },
      { id: 'm9', name: 'Risperidona (Noche)', dose: '1mg', timeBlock: '20:00', tmax: 1.5, halflife: 20, role: 'Modulación nocturna' },
      { id: 'm10', name: 'Clonazepam', dose: '0.5mg', timeBlock: '20:00', tmax: 2.5, halflife: 35, role: 'Inductor del sueño GABAérgico' }
    ],
    takenBlocksToday: {
      '07:00': false,
      '13:00': false,
      '16:00': false,
      '20:00': false
    },
    takenTimes: {}
  },
  exercise: {
    consecutiveNoPainDays: 14,
    completedSessions: 18,
    todayKneeLogged: false,
    routineExercises: [
      { name: 'Wall-Sit Isométrico a 45°', desc: 'Espalda firme a la pared sin bajar a 90°. Cuádriceps bajo tensión continua sin compresión meniscal.', time: '4 series x 45 seg' },
      { name: 'Elevación de Pierna Recta (SLR)', desc: 'Acostado bocarriba, pierna en extensión completa activa el vasto medial.', time: '3 series x 15 reps por pierna' },
      { name: 'Puente de Glúteo Isométrico Bipodal', desc: 'Elevación de pelvis activando glúteos e isquiotibiales para descarga anterior de rodilla.', time: '4 series x 40 seg' },
      { name: 'Curl Femoral con Toalla en Suelo', desc: 'Flexión de rodilla en suelo suave fortaleciendo isquiotibiales.', time: '3 series x 12 reps' },
      { name: 'Marcha Estática Controlada en Césped', desc: 'Elevación rítmica de rodillas sin impacto para translocación de GLUT4 y BDNF.', time: '5 minutos continuos' }
    ]
  },
  work: {
    currentCycle: 0,
    mode: 'work', // 'work' (25 min) o 'rest' (5 min)
    secondsRemaining: 25 * 60,
    isRunning: false,
    restAudits: [],
    posCart: [],
    posTokenBalance: 150.0,
    productSalesCount: {
      'Huevo Orgánico (Kg)': 42,
      'Calabacitas Criollas (Kg)': 28,
      'Nopales (Docena)': 24,
      'Humus de Lombriz (5Kg)': 12,
      'Abarrote General': 19
    },
    eggsCountToday: 8
  },
  study: {
    secondsElapsed: 0,
    isRunning: false,
    activeBranch: 'Maestría en Ciencias',
    branches: [
      { name: 'Maestría en Ciencias', desc: 'Biología Molecular, Física Cuántica & Matemáticas Avanzadas', hours: 42.5 },
      { name: 'Doctorado Neuroingeniería', desc: 'Modelado BCI, Neuroprótesis, Admisión en Alemania', hours: 38.0 },
      { name: 'Inglés', desc: 'Nivel C1/C2 Académico & Redacción Científica', hours: 26.0 },
      { name: 'Alemán', desc: 'Goethe Zertifikat B2/C1 para estancia doctoral', hours: 31.5 },
      { name: 'Música de Órgano', desc: 'Contrapunto, Polifonía & Técnica de Pedalero', hours: 19.0 },
      { name: 'Teología Tomista', desc: 'Metafísica del Ser, Epistemología & Filosofía Tomista', hours: 22.0 }
    ]
  }
};

let aegisState = null;
let pomodoroInterval = null;
let exerciseTimerInterval = null;
let studyTimerInterval = null;
let sleepStopwatchInterval = null;
let scaleDriver = null;
let audioCtx = null;

// Helpers globales para control infalible de modales
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.add('open');
    m.style.setProperty('display', 'flex', 'important');
  }
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('open');
    m.style.setProperty('display', 'none', 'important');
  }
}

// =============================================================================
// 2. INICIALIZACIÓN
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que todos los modales estén ocultos de inicio
  [
    'bleHelpModal', 'addPantryModal', 'newRewardModal', 'newProjectModal',
    'editProjectModal', 'newMedModal', 'editMedModal', 'posModal', 'relapseEmergencyModal'
  ].forEach(closeModal);

  loadMasterState();
  initScaleDriverSafe();
  initTheme();
  setupAllEventListeners();
  initSleepStopwatch();
  updateClockAndHeader();
  setInterval(updateClockAndHeader, 30000);

  // Renderizar vistas de todos los módulos
  renderSleepModule();
  renderAbstinenceModule();
  renderDailyRecordsHistory();
  renderAccountingModule();
  renderNutritionModule();
  renderMedicationModule();
  renderExerciseModule();
  renderWorkModule();
  renderStudyModule();
});

function loadMasterState() {
  const saved = localStorage.getItem('aegis_master_state');
  if (saved) {
    try {
      aegisState = JSON.parse(saved);
      // Asegurar campos si hubo migraciones
      aegisState.accounting = Object.assign({}, DEFAULT_STATE.accounting, aegisState.accounting);
      aegisState.nutrition = Object.assign({}, DEFAULT_STATE.nutrition, aegisState.nutrition);
      aegisState.medication = Object.assign({}, DEFAULT_STATE.medication, aegisState.medication);
      aegisState.exercise = Object.assign({}, DEFAULT_STATE.exercise, aegisState.exercise);
      aegisState.work = Object.assign({}, DEFAULT_STATE.work, aegisState.work);
      aegisState.study = Object.assign({}, DEFAULT_STATE.study, aegisState.study);
      aegisState.sleep = Object.assign({}, DEFAULT_STATE.sleep, aegisState.sleep);
      aegisState.abstinence = Object.assign({}, DEFAULT_STATE.abstinence, aegisState.abstinence);

      // Migración estricta para garantizar fecha del 15 de octubre de 2026 y sincronización de abstinencia
      if (!localStorage.getItem('aegis_v3_oct15')) {
        aegisState.currentDate = '2026-10-14';
        aegisState.sobrietyStartDate = '2026-10-14';
        aegisState.sobrietyDays = 6;
        aegisState.abstinence = {
          startDate: '2026-10-14',
          days: 6,
          alcoholCraving: 1,
          smokeCraving: 1,
          cravingHistory: [],
          relapses: []
        };
        aegisState.weightHistory = [{ date: '15/10/2026', weight: 74.5 }];
        aegisState.sleep.history = [{ date: '15/10/2026', hours: 9.0, quality: 5, protocol: true }];
        if (aegisState.work) {
          aegisState.work.currentCycle = 0;
          aegisState.work.posTokenBalance = 150.0;
          aegisState.work.productSalesCount = {
            'Huevo Orgánico (Kg)': 42,
            'Calabacitas Criollas (Kg)': 28,
            'Nopales (Docena)': 24,
            'Humus de Lombriz (5Kg)': 12,
            'Abarrote General': 19
          };
        }
        localStorage.setItem('aegis_v3_oct15', 'true');
      }

      // Migración v4 para corregir inicio a 14 de octubre de 2026 y cálculo dinámico de racha
      if (!localStorage.getItem('aegis_v4_oct14_dynamic') || (aegisState.abstinence && aegisState.abstinence.startDate === '2026-10-15')) {
        aegisState.abstinence = aegisState.abstinence || {};
        aegisState.abstinence.startDate = '2026-10-14';
        aegisState.sobrietyStartDate = '2026-10-14';
        aegisState.abstinence.relapsedToday = false;
        delete aegisState.abstinence.lastRelapseDate;
        localStorage.setItem('aegis_v4_oct14_dynamic', 'true');
      }

      // Sincronizar dinámicamente los días de abstinencia en arranque
      const initAbsStats = calculateAbstinenceStats();
      aegisState.abstinence.days = initAbsStats.days;
      aegisState.sobrietyDays = initAbsStats.days;

      // Asegurar historial de registros diarios comenzando el 15 de octubre de 2026
      if (!aegisState.dailyRecords || !Array.isArray(aegisState.dailyRecords) || aegisState.dailyRecords.length === 0) {
        aegisState.dailyRecords = JSON.parse(JSON.stringify(DEFAULT_STATE.dailyRecords));
      }
      if (!aegisState.lastActiveDate) {
        aegisState.lastActiveDate = '2026-10-19';
      }
      aegisState.currentDate = '2026-10-19';

      // Asegurar Sertralina en bloque matutino 07:00
      if (aegisState.medication && aegisState.medication.medsList) {
        const hasSertAm = aegisState.medication.medsList.some(m => m.name.toLowerCase().includes('sertralina') && m.timeBlock === '07:00');
        if (!hasSertAm) {
          aegisState.medication.medsList.splice(2, 0, {
            id: 'm_sert_am',
            name: 'Sertralina',
            dose: '50mg',
            timeBlock: '07:00',
            tmax: 6.0,
            halflife: 26,
            role: 'ISRS serotonina matutina'
          });
        }
      }

      // Migración estricta para garantizar 0 pesos en arranque v2
      if (!localStorage.getItem('aegis_accounting_v2_zero')) {
        aegisState.accounting.currentMonthIncome = 0;
        aegisState.accounting.buckets = { b1_daily: 0, b2_weekly: 0, b3_monthly: 0, b4_invest: 0, b5_rewards: 0 };
        aegisState.accounting.ledger = [];
        localStorage.setItem('aegis_accounting_v2_zero', 'true');
      }
      if (!Array.isArray(aegisState.accounting.ledger)) {
        aegisState.accounting.ledger = [];
      }
    } catch (e) {
      console.error('Error al cargar estado, restaurando valores por defecto', e);
      aegisState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    aegisState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    localStorage.setItem('aegis_accounting_v2_zero', 'true');
    localStorage.setItem('aegis_v3_oct15', 'true');
  }
}

function saveMasterState() {
  localStorage.setItem('aegis_master_state', JSON.stringify(aegisState));
  updateHeaderStats();
}

function initTheme() {
  const saved = localStorage.getItem('aegis_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('aegis_theme', next);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
}

// Cálculo dinámico determinista de racha de abstinencia según calendario local
function calculateAbstinenceStats() {
  if (!aegisState.abstinence) {
    aegisState.abstinence = {
      startDate: '2026-10-14',
      days: 6,
      alcoholCraving: 1,
      smokeCraving: 1,
      cravingHistory: [],
      relapses: []
    };
  }

  let startDateStr = aegisState.abstinence.startDate || aegisState.sobrietyStartDate || '2026-10-14';
  
  // Extraer año, mes (0-indexado) y día de la fecha de inicio para evitar desfases de huso horario
  let startYear, startMonth, startDay;
  if (typeof startDateStr === 'string' && startDateStr.includes('-')) {
    const parts = startDateStr.split('T')[0].split('-').map(Number);
    startYear = parts[0];
    startMonth = parts[1] - 1;
    startDay = parts[2];
  } else {
    const sd = new Date(startDateStr);
    startYear = sd.getFullYear();
    startMonth = sd.getMonth();
    startDay = sd.getDate();
  }

  const startMidnight = new Date(startYear, startMonth, startDay, 0, 0, 0, 0).getTime();
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
  const todayIsoDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Verificar si hubo reincidencia registrada hoy
  const isRelapsedToday = aegisState.abstinence.lastRelapseDate === todayIsoDate || aegisState.abstinence.relapsedToday === true;

  if (isRelapsedToday) {
    return {
      fullDays: 0,
      currentDayNumber: 0,
      days: 0,
      isRelapsed: true,
      startDateStr: startDateStr.split('T')[0]
    };
  }

  const diffMs = nowMidnight - startMidnight;
  const fullDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  // Ejemplo: Inicio 14-Oct, Hoy 19-Oct -> diffMs = 5 días completos transcurridos -> Día 6 en curso
  const currentDayNumber = fullDays + 1;

  return {
    fullDays,
    currentDayNumber,
    days: currentDayNumber,
    isRelapsed: false,
    startDateStr: startDateStr.split('T')[0]
  };
}

function updateClockAndHeader() {
  checkAutomaticDayRollover();
  updateHeaderStats();
}

function updateHeaderStats() {
  const dateEl = document.getElementById('headerCurrentDateDisplay');
  const sobEl = document.getElementById('statSobrietyDays');
  const wEl = document.getElementById('headerWeightVal');
  const sEl = document.getElementById('headerSleepVal');
  const iEl = document.getElementById('headerIncomeVal');
  const pEl = document.getElementById('headerPomodoroVal');

  if (dateEl) {
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const stats = calculateAbstinenceStats();
  aegisState.abstinence.days = stats.days;
  aegisState.sobrietyDays = stats.days;

  if (sobEl) {
    sobEl.textContent = stats.isRelapsed ? 'Día 0' : `Día ${stats.currentDayNumber}`;
  }
  if (wEl) wEl.textContent = `${aegisState.userProfile.weight.toFixed(1)} kg`;
  if (sEl) sEl.textContent = `${aegisState.sleep.actualHours} h`;
  if (iEl) {
    iEl.textContent = `$${aegisState.accounting.currentMonthIncome.toLocaleString()} / $500k`;
  }
  if (pEl) pEl.textContent = `${aegisState.work.currentCycle}/8`;
}

// Audio Chime de estabilización y alerta
function playChime(freq1 = 587.33, freq2 = 880, dur = 0.35) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}

// =============================================================================
// 3. INTEGRACIÓN DEL DRIVER RENPHO BLUETOOTH (scale.js)
// =============================================================================

function initScaleDriverSafe() {
  if (typeof RenphoScaleDriver === 'undefined') {
    console.warn('RenphoScaleDriver no encontrado en scale.js.');
    return;
  }

  scaleDriver = new RenphoScaleDriver();

  scaleDriver.on('onStatus', (state, msg) => {
    updateScaleUIState(state, msg);
  });

  scaleDriver.on('onError', (err) => {
    updateScaleUIState('disconnected', `Error: ${err.message}`);
  });

  scaleDriver.on('onWeight', (data) => {
    const disp = document.getElementById('liveWeightDisplay');
    if (disp) disp.textContent = data.weightKg.toFixed(1);

    if (data.isStable) {
      updateScaleUIState('stabilized');
      playChime(587.33, 880, 0.4);
      registerNewWeight(data.weightKg);
    } else {
      updateScaleUIState('measuring');
    }
  });

  scaleDriver.on('onBattery', (level) => {
    const bBadge = document.getElementById('scaleBatteryBadge');
    const bLvl = document.getElementById('scaleBatteryLevel');
    if (bBadge && bLvl) {
      bBadge.style.display = 'inline-flex';
      bLvl.textContent = `${level}%`;
    }
  });

  scaleDriver.on('onDisconnect', () => {
    updateScaleUIState('disconnected', 'Báscula desconectada.');
  });
}

function updateScaleUIState(state, text) {
  const badge = document.getElementById('scaleStatusBadge');
  const detail = document.getElementById('scaleStatusDetail');
  const box = document.getElementById('scaleDisplayBox');
  const liveTag = document.getElementById('scaleLiveTag');
  const btnConnect = document.getElementById('connectBleBtn');
  const btnDisconnect = document.getElementById('disconnectBleBtn');
  const devBadge = document.getElementById('scaleDeviceBadge');
  const devName = document.getElementById('scaleDeviceName');
  const protoBadge = document.getElementById('scaleProtocolBadge');
  const protoName = document.getElementById('scaleProtocolName');

  if (box) box.classList.remove('measuring', 'stabilized');

  switch (state) {
    case 'searching':
      if (badge) { badge.className = 'status-badge connecting'; badge.textContent = 'Buscando...'; }
      if (liveTag) liveTag.textContent = 'BUSCANDO';
      if (detail) detail.textContent = text || 'Selecciona tu báscula Renpho en la lista...';
      if (btnConnect) btnConnect.disabled = true;
      break;

    case 'connecting':
    case 'discovering':
      if (badge) { badge.className = 'status-badge connecting'; badge.textContent = 'Conectando...'; }
      if (liveTag) liveTag.textContent = 'ENLAZANDO';
      if (detail) detail.textContent = text || 'Sincronizando servicios BLE...';
      if (btnConnect) btnConnect.disabled = true;
      break;

    case 'connected':
      if (badge) { badge.className = 'status-badge connected'; badge.textContent = 'Conectada'; }
      if (liveTag) liveTag.textContent = 'LISTA PARA PESAR';
      if (detail) detail.textContent = 'Párate sobre la báscula descalzo.';
      if (btnConnect) btnConnect.style.display = 'none';
      if (btnDisconnect) btnDisconnect.style.display = 'inline-flex';
      if (devBadge && scaleDriver && scaleDriver.device) {
        devBadge.style.display = 'inline-flex';
        devName.textContent = scaleDriver.device.name || 'Renpho';
      }
      if (protoBadge && scaleDriver) {
        protoBadge.style.display = 'inline-flex';
        protoName.textContent = scaleDriver.protocol || 'QN/LeFu';
      }
      break;

    case 'measuring':
      if (box) box.classList.add('measuring');
      if (liveTag) liveTag.textContent = 'MIDIÉNDOTE...';
      if (detail) detail.textContent = 'Quédate quieto sobre la báscula...';
      break;

    case 'stabilized':
      if (box) box.classList.add('stabilized');
      if (liveTag) liveTag.textContent = '✓ PESO FIJADO';
      if (detail) detail.textContent = '¡Pesaje completado y registrado con éxito!';
      break;

    case 'disconnected':
    default:
      if (badge) { badge.className = 'status-badge disconnected'; badge.textContent = 'Desconectada'; }
      if (liveTag) liveTag.textContent = 'EN REPOSO';
      if (detail) detail.textContent = text || 'Enciende la báscula pisándola antes de conectar';
      if (btnConnect) { btnConnect.disabled = false; btnConnect.style.display = 'inline-flex'; }
      if (btnDisconnect) btnDisconnect.style.display = 'none';
      if (devBadge) devBadge.style.display = 'none';
      if (protoBadge) protoBadge.style.display = 'none';
      break;
  }
}

function registerNewWeight(weightKg) {
  const rounded = Math.round(weightKg * 10) / 10;
  aegisState.userProfile.weight = rounded;
  const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  aegisState.weightHistory.unshift({ date: todayStr, weight: rounded });
  if (aegisState.weightHistory.length > 7) aegisState.weightHistory.pop();

  saveMasterState();
  renderNutritionModule();
  checkExerciseUnlocks();
}

function simulateScaleReading() {
  updateScaleUIState('connecting', 'Simulando sensor de pesaje matutino...');
  let currentW = aegisState.userProfile.weight || 74.5;
  const sim = Math.round((currentW + (Math.random() * 0.6 - 0.3)) * 10) / 10;

  let step = 0;
  const interval = setInterval(() => {
    step++;
    const flicker = (sim - 1.5 + Math.random() * 3).toFixed(1);
    const disp = document.getElementById('liveWeightDisplay');
    if (disp) disp.textContent = flicker;

    if (step >= 5) {
      clearInterval(interval);
      updateScaleUIState('stabilized');
      playChime(587.33, 880, 0.4);
      registerNewWeight(sim);
    }
  }, 200);
}

// =============================================================================
// 4. MÓDULO 1: SUEÑO Y CRONOBIOLOGÍA (CRONÓMETRO DE SUEÑO & AUDITORÍA)
// =============================================================================

function initSleepStopwatch() {
  const s = aegisState.sleep;
  if (s.sleepTimerRunning && s.sleepStartTime) {
    startSleepStopwatchTicker();
  } else {
    updateSleepStopwatchUI(false);
  }
}

function startSleepStopwatchTicker() {
  const s = aegisState.sleep;
  const disp = document.getElementById('sleepStopwatchDisplay');
  const statusPill = document.getElementById('sleepStopwatchStatus');
  const sub = document.getElementById('sleepStopwatchSub');
  const btnStart = document.getElementById('btnStartSleepStopwatch');
  const btnStop = document.getElementById('btnStopSleepStopwatch');

  if (btnStart) btnStart.style.display = 'none';
  if (btnStop) btnStop.style.display = 'block';
  if (statusPill) {
    statusPill.className = 'stopwatch-status-pill sleeping';
    statusPill.textContent = 'DURMIENDO (CRONÓMETRO ACTIVO)';
  }

  const startTimeDate = new Date(s.sleepStartTime);
  const timeStr = startTimeDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (sub) sub.textContent = `Iniciado a las ${timeStr} • Tiempo transcurrido acumulándose de forma continua.`;

  if (sleepStopwatchInterval) clearInterval(sleepStopwatchInterval);
  sleepStopwatchInterval = setInterval(() => {
    if (!aegisState.sleep.sleepStartTime) return;
    const elapsedMs = Math.max(0, Date.now() - aegisState.sleep.sleepStartTime);
    const totalSecs = Math.floor(elapsedMs / 1000);
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    if (disp) disp.textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function updateSleepStopwatchUI(isRunning) {
  const disp = document.getElementById('sleepStopwatchDisplay');
  const statusPill = document.getElementById('sleepStopwatchStatus');
  const sub = document.getElementById('sleepStopwatchSub');
  const btnStart = document.getElementById('btnStartSleepStopwatch');
  const btnStop = document.getElementById('btnStopSleepStopwatch');

  if (isRunning) {
    if (btnStart) btnStart.style.display = 'none';
    if (btnStop) btnStop.style.display = 'block';
  } else {
    if (sleepStopwatchInterval) clearInterval(sleepStopwatchInterval);
    if (btnStart) btnStart.style.display = 'block';
    if (btnStop) btnStop.style.display = 'none';
    if (statusPill) {
      statusPill.className = 'stopwatch-status-pill';
      statusPill.textContent = 'EN REPOSO / DESPIERTO';
    }
    if (disp) disp.textContent = '00:00:00';
    if (sub) sub.textContent = 'Pulsa el botón al acostarte para iniciar el cronómetro continuo de sueño.';
  }
}

function handleStartSleep() {
  aegisState.sleep.sleepTimerRunning = true;
  aegisState.sleep.sleepStartTime = Date.now();
  saveMasterState();
  startSleepStopwatchTicker();
}

function handleStopSleep() {
  if (!aegisState.sleep.sleepStartTime) return;
  const elapsedMs = Math.max(0, Date.now() - aegisState.sleep.sleepStartTime);
  const hours = Math.round((elapsedMs / (1000 * 60 * 60)) * 10) / 10;
  
  aegisState.sleep.sleepTimerRunning = false;
  aegisState.sleep.actualHours = hours > 0 ? hours : 9.0;
  aegisState.sleep.sleepStartTime = null;

  updateSleepStopwatchUI(false);
  const inpHours = document.getElementById('inputSleepHours');
  if (inpHours) inpHours.value = aegisState.sleep.actualHours;

  const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const selQual = document.getElementById('selectSleepQuality');
  const quality = selQual ? parseInt(selQual.value, 10) : 4;
  const chkProto = document.getElementById('chkSleepProtocolAccomplished');
  const protocol = chkProto ? chkProto.checked : (aegisState.sleep.actualHours >= 8.5);

  aegisState.sleep.quality = quality;
  aegisState.sleep.protocolAccomplished = protocol;
  aegisState.sleep.history.unshift({
    date: todayStr,
    hours: aegisState.sleep.actualHours,
    quality,
    protocol
  });
  if (aegisState.sleep.history.length > 7) aegisState.sleep.history.pop();

  saveMasterState();
  renderSleepModule();
  updateHeaderStats();
  playChime();
  alert(`☀️ ¡Buenos días! Cronómetro apagado con éxito.\nSe registraron ${aegisState.sleep.actualHours} horas de sueño guardadas en tu historial de los últimos 7 días.`);
}

function renderSleepModule() {
  const s = aegisState.sleep;
  const chkMed = document.getElementById('chkSleepMedNight');
  const chkScreens = document.getElementById('chkSleepScreensOff');
  const chkProto = document.getElementById('chkSleepProtocolAccomplished');
  const inpHours = document.getElementById('inputSleepHours');
  const selQual = document.getElementById('selectSleepQuality');
  const badge = document.getElementById('sleepComplianceBadge');

  if (chkMed) chkMed.checked = s.nightMedChecked;
  if (chkScreens) chkScreens.checked = s.screensOffChecked;
  if (chkProto) chkProto.checked = s.protocolAccomplished;
  if (inpHours) inpHours.value = s.actualHours;
  if (selQual) selQual.value = s.quality;

  // Lógica Determinista de Diagnóstico de Neuroquímica & Craving
  const diagBox = document.getElementById('sleepDiagnosticBox');
  if (diagBox) {
    let diagHtml = '';
    const h = s.actualHours;
    const q = s.quality;

    if (h >= 9.0 && s.protocolAccomplished) {
      if (badge) { badge.className = 'status-badge success'; badge.textContent = 'Óptimo (9h)'; }
      diagHtml = `
        <div class="text-success font-bold">✓ RECUPERACIÓN NEUROLÓGICA PLENA (9h Logradas)</div>
        <p class="mt-1">Arquitectura REM y ondas lentas N3 restauradas. Transcripción máxima de <strong>BDNF</strong> en hipocampo para consolidación de aprendizaje. Corteza prefrontal con máximo control inhibitorio.</p>
        <div class="mt-1"><strong>Riesgo de Craving (Alcohol / Azúcar):</strong> <span class="status-badge success">0% - Nulo</span></div>
      `;
    } else if (h >= 7.5) {
      if (badge) { badge.className = 'status-badge warn'; badge.textContent = 'Parcial'; }
      diagHtml = `
        <div class="text-warning font-bold">⚠️ SUEÑO SUFICIENTE PERO SUB-ÓPTIMO (${h}h de 9h meta)</div>
        <p class="mt-1">Déficit acumulativo ligero. Posible caída de tono dopaminérgico a media tarde (15:00 - 16:00). <em>Acción determinista:</em> No exceder cafeína matutina; tomar estrictamente el snack de rescate con canela a las 16:00 para evitar fatiga compensatoria.</p>
        <div class="mt-1"><strong>Riesgo de Craving:</strong> <span class="status-badge warn">Bajo (15%) - Mantener alerta HALT</span></div>
      `;
    } else {
      if (badge) { badge.className = 'status-badge danger'; badge.textContent = 'Déficit Crítico'; }
      diagHtml = `
        <div class="text-danger font-bold">🚨 ALERTA: PRIVACIÓN DE SUEÑO CRÍTICA (&lt; 7.5h)</div>
        <p class="mt-1">La corteza prefrontal presenta un 30% menos de control inhibitorio sobre el núcleo accumbens. <strong>Alto riesgo de impulso por alcohol o azúcar simple.</strong> El sistema limitará la intensidad de trabajo y exigirá pausas de respiración.</p>
        <div class="mt-1"><strong>Riesgo de Craving:</strong> <span class="status-badge danger">Alto (&gt;60%) - Protocolo Anti-Recaída en espera</span></div>
      `;
    }
    diagBox.innerHTML = diagHtml;
  }

  // Renderizar historial de los últimos 7 días
  const histEl = document.getElementById('sleepHistoryList');
  if (histEl && s.history) {
    histEl.innerHTML = s.history.map(item => `
      <div class="mini-table-row">
        <span>📅 ${item.date}</span>
        <span><strong>${item.hours}h</strong> (Calidad: ${item.quality}/5)</span>
        <span>${item.protocol ? '✅ Protocolo Cumplido' : '⚠️ Desfase'}</span>
      </div>
    `).join('');
  }

  // Renderizar tabla de registros históricos diarios comenzando el 15 de octubre de 2026
  renderDailyRecordsHistory();
}

function saveSleepLog() {
  const inpHours = document.getElementById('inputSleepHours');
  const selQual = document.getElementById('selectSleepQuality');
  const chkProto = document.getElementById('chkSleepProtocolAccomplished');
  const chkMed = document.getElementById('chkSleepMedNight');
  const chkScreens = document.getElementById('chkSleepScreensOff');

  const hours = parseFloat(inpHours.value) || 9.0;
  const quality = parseInt(selQual.value, 10) || 4;
  const protocol = chkProto.checked;

  aegisState.sleep.actualHours = hours;
  aegisState.sleep.quality = quality;
  aegisState.sleep.protocolAccomplished = protocol;
  aegisState.sleep.nightMedChecked = chkMed.checked;
  aegisState.sleep.screensOffChecked = chkScreens.checked;

  const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  aegisState.sleep.history.unshift({ date: todayStr, hours, quality, protocol });
  if (aegisState.sleep.history.length > 7) aegisState.sleep.history.pop();

  saveMasterState();
  renderSleepModule();
  updateHeaderStats();
  alert('Registro de sueño guardado con éxito.');
}

// Renderizar Historial de Registros Diarios (Desde el 15 de Octubre de 2026)
function renderDailyRecordsHistory() {
  const tbody = document.getElementById('dailyRecordsTableBody');
  if (!tbody) return;

  const records = aegisState.dailyRecords || [];
  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding: 1.5rem;">Sin registros diarios archivados aún. Se irán guardando día con día a partir del 15 de octubre de 2026.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const protoBadge = r.sleepProtocol ? '<span class="status-badge success">✓ 20:30-06:00</span>' : '<span class="status-badge warn">Incompleto</span>';
    const mealsDone = r.mealsCount !== undefined ? r.mealsCount : 7;
    const medsDone = r.medBlocksCount !== undefined ? r.medBlocksCount : 4;
    const pomos = r.pomodoroCycles !== undefined ? r.pomodoroCycles : 8;

    return `
      <tr>
        <td><strong>📅 ${r.date}</strong></td>
        <td><span class="status-badge success">Día ${r.sobrietyDay}</span></td>
        <td>${(r.weight || 74.5).toFixed(1)} kg</td>
        <td><strong>${(r.sleepHours || 9.0).toFixed(1)} h</strong></td>
        <td>${protoBadge}</td>
        <td>${mealsDone}/7 comidas</td>
        <td>${medsDone}/4 bloques</td>
        <td><span class="badge-pill">${pomos}/8 pomodoros</span></td>
        <td><small class="text-muted">${r.notes || 'Auditoría completada'}</small></td>
      </tr>
    `;
  }).join('');
}

// Verificación automática de nuevo día de calendario (rollover)
function checkAutomaticDayRollover() {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  if (!aegisState.lastActiveDate) {
    aegisState.lastActiveDate = todayIso;
    saveMasterState();
    return;
  }

  if (aegisState.lastActiveDate !== todayIso) {
    // Ha cambiado la fecha del calendario
    executeDayRollover(false);
  }
}

function handleManualDayRollover() {
  const confirmMsg = `¿Confirmas cerrar la jornada actual (${aegisState.currentDate || 'hoy'})?\n\n• Se archivarán tus métricas de hoy (sueño, comidas, medicación, pomodoro y peso) en el Historial Diario desde el 15 de Octubre de 2026.\n• Se reiniciarán los protocolos de sueño y cronobiología, cronograma diario de comidas, tomas por bloques y pomodoro para el nuevo día.\n• El contador de abstinencia continuará sumando días continuos.`;
  if (confirm(confirmMsg)) {
    executeDayRollover(true);
  }
}

function executeDayRollover(isManual = false) {
  const now = new Date();
  const currentIso = aegisState.currentDate || '2026-10-19';
  const parts = currentIso.split('-');
  const dateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;

  // 1. Archivar el registro de la jornada que culmina
  if (!aegisState.dailyRecords) aegisState.dailyRecords = [];

  const existingIdx = aegisState.dailyRecords.findIndex(r => r.isoDate === currentIso);
  const mealsDone = (aegisState.nutrition.mealSchedule || []).filter(m => m.consumed).length;
  const medsDone = Object.values(aegisState.medication.takenBlocksToday || {}).filter(Boolean).length;
  const maxCraving = (aegisState.abstinence.cravingHistory || []).reduce((max, c) => Math.max(max, c.alcohol || 1), 1);
  const sobrietyDay = calculateAbstinenceStats().days;

  const recordEntry = {
    date: dateFormatted,
    isoDate: currentIso,
    sobrietyDay: sobrietyDay,
    weight: aegisState.userProfile.weight || 74.0,
    sleepHours: aegisState.sleep.actualHours || 9.0,
    sleepProtocol: aegisState.sleep.protocolAccomplished || false,
    mealsCount: mealsDone,
    medBlocksCount: medsDone,
    pomodoroCycles: aegisState.work.currentCycle || 0,
    cravingMax: maxCraving,
    notes: isManual ? 'Cierre de jornada manual por el usuario.' : 'Cierre automático por cambio de día de calendario.'
  };

  if (existingIdx >= 0) {
    aegisState.dailyRecords[existingIdx] = recordEntry;
  } else {
    aegisState.dailyRecords.unshift(recordEntry);
  }

  // 2. Reiniciar los protocolos diarios para el NUEVO DÍA
  // Sueño & Cronobiología
  aegisState.sleep.nightMedChecked = false;
  aegisState.sleep.screensOffChecked = false;
  aegisState.sleep.protocolAccomplished = false;
  if (!aegisState.sleep.sleepTimerRunning) {
    aegisState.sleep.actualHours = 0;
  }

  // Cronograma de comidas y checklist de horas
  if (aegisState.nutrition && aegisState.nutrition.mealSchedule) {
    aegisState.nutrition.mealSchedule.forEach(meal => {
      meal.consumed = false;
      meal.consumedTime = '';
    });
  }
  aegisState.nutrition.hungerHistoryToday = [];

  // Tomas de medicación por bloques
  if (aegisState.medication) {
    aegisState.medication.takenBlocksToday = {
      '07:00': false,
      '13:00': false,
      '16:00': false,
      '20:00': false
    };
    aegisState.medication.takenTimes = {};
  }

  // Trabajo & Pomodoro diario
  if (aegisState.work) {
    aegisState.work.currentCycle = 0;
    aegisState.work.secondsRemaining = 25 * 60;
    aegisState.work.mode = 'work';
  }

  // Actualizar fecha actual
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  aegisState.currentDate = todayIso;
  aegisState.lastActiveDate = todayIso;

  // Recalcular racha dinámicamente (aumenta según calendario)
  const absStats = calculateAbstinenceStats();
  aegisState.abstinence.days = absStats.days;
  aegisState.sobrietyDays = absStats.days;

  saveMasterState();

  // Re-renderizar todos los módulos
  renderSleepModule();
  renderAbstinenceModule();
  renderDailyRecordsHistory();
  renderAccountingModule();
  renderNutritionModule();
  renderMedicationModule();
  renderExerciseModule();
  renderWorkModule();
  renderStudyModule();
  updateHeaderStats();

  playChime(440, 880, 0.4);
  if (isManual) {
    alert(`✓ Jornada cerrada y archivada con éxito (${dateFormatted}).\n\n• Checklists de sueño, nutrición, medicación y pomodoro reiniciados para el nuevo día.\n• Contador de abstinencia actualizado a Día ${absStats.days}.`);
  }
}

// =============================================================================
// 4.B. MÓDULO 1.B: REGISTRO DE CRAVING (ALCOHOL & TABACO) Y CONTADOR DE ABSTINENCIA
// =============================================================================

function renderAbstinenceModule() {
  const stats = calculateAbstinenceStats();
  aegisState.abstinence.days = stats.days;
  aegisState.sobrietyDays = stats.days;

  const daysEl = document.getElementById('abstinenceHeroDaysDisplay');
  const startEl = document.getElementById('abstinenceStartDateDisplay');
  const badgeEl = document.getElementById('abstinenceStatusBadge');
  const historyEl = document.getElementById('cravingHistoryTable');
  const inputStartDate = document.getElementById('inputAbstinenceStartDate');

  if (daysEl) {
    if (stats.isRelapsed) {
      daysEl.textContent = '0 días';
      daysEl.style.color = 'var(--danger-red)';
    } else {
      daysEl.textContent = `${stats.days} ${stats.days === 1 ? 'día' : 'días'}`;
      daysEl.style.color = 'var(--accent)';
    }
  }

  if (startEl) {
    const parts = stats.startDateStr.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const formatted = isNaN(d.getTime()) ? stats.startDateStr : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    if (stats.isRelapsed) {
      startEl.textContent = `Reincidencia registrada hoy • Contador en Día 0`;
    } else {
      const fullDaysText = stats.fullDays === 1 ? '1 día completo transcurrido' : `${stats.fullDays} días completos transcurridos`;
      startEl.textContent = `Racha iniciada: ${formatted} • ${fullDaysText} (Día ${stats.currentDayNumber} en curso)`;
    }
  }

  if (inputStartDate) {
    inputStartDate.value = stats.startDateStr;
  }

  if (badgeEl) {
    if (!stats.isRelapsed && stats.days > 0) {
      badgeEl.className = 'status-badge success';
      badgeEl.textContent = 'Abstinencia Activa';
    } else {
      badgeEl.className = 'status-badge danger';
      badgeEl.textContent = 'Reinicio / Día 0';
    }
  }

  if (historyEl) {
    const history = aegisState.abstinence.cravingHistory || [];
    if (history.length === 0) {
      const todayFormatted = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      historyEl.innerHTML = `
        <div class="text-xs text-muted p-2 text-center">
          Sin episodios de craving registrados el día de hoy (${todayFormatted}). Utiliza los sliders para auditar tu estado fisiológico.
        </div>
      `;
    } else {
      historyEl.innerHTML = history.slice(0, 10).map(item => {
        const alcClass = item.alcohol >= 4 ? 'level-4' : item.alcohol === 3 ? 'level-3' : 'level-1';
        const smokeClass = item.smoke >= 4 ? 'level-4' : item.smoke === 3 ? 'level-3' : 'level-1';
        return `
          <div class="craving-history-item">
            <div>
              <strong>📅 ${item.timestamp}</strong>
              <div class="text-xs text-muted mt-1">
                ${item.context ? `<em>Detonante:</em> "${item.context}" • ` : ''}${item.action}
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="craving-pill-val ${alcClass}">🍺 Alcohol: ${item.alcohol}/5</span>
              <span class="craving-pill-val ${smokeClass}">🚬 Tabaco: ${item.smoke}/5</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  updateCravingSliderDisplay();
}

function handleRelapseReset() {
  const confirmMsg = `⚠️ ADVERTENCIA DETERMINISTA DE REINCIDENCIA ⚠️\n\n¿Confirmas registrar una ingesta de alcohol o consumo de tabaco?\n\nEsta acción reiniciará tu contador de días en abstinencia a DÍA 0 y estampará la fecha y hora exacta en la auditoría.\n\nLa honestidad con tus datos duros es la clave para la recuperación.`;
  if (confirm(confirmMsg)) {
    const now = new Date();
    const todayIsoDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    aegisState.abstinence.relapsedToday = true;
    aegisState.abstinence.lastRelapseDate = todayIsoDate;
    aegisState.abstinence.startDate = todayIsoDate;
    aegisState.sobrietyStartDate = todayIsoDate;
    aegisState.abstinence.days = 0;
    aegisState.sobrietyDays = 0;

    const nowFormatted = now.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (!aegisState.abstinence.relapses) aegisState.abstinence.relapses = [];
    aegisState.abstinence.relapses.unshift({ timestamp: nowFormatted, note: 'Reincidencia reportada por el usuario' });

    if (!aegisState.abstinence.cravingHistory) aegisState.abstinence.cravingHistory = [];
    aegisState.abstinence.cravingHistory.unshift({
      timestamp: nowFormatted,
      alcohol: 5,
      smoke: 5,
      context: 'REINCIDENCIA REPORTADA - Contador reiniciado a Día 0',
      action: 'Protocolo de reseteo ejecutado. Aplicar descanso e hidratación inmediata.'
    });

    saveMasterState();
    renderAbstinenceModule();
    updateHeaderStats();
    renderRewardsList();
    playChime(220, 110, 0.6);
    alert('Contador de abstinencia restablecido a Día 0.\nEl camino se retoma de inmediato con compromiso hoy mismo.');
  }
}

function handleUpdateAbstinenceStartDate() {
  const input = document.getElementById('inputAbstinenceStartDate');
  if (!input || !input.value) {
    alert('Por favor selecciona una fecha válida.');
    return;
  }
  const newDateStr = input.value;
  const parts = newDateStr.split('-').map(Number);
  const testDate = new Date(parts[0], parts[1] - 1, parts[2]);
  if (isNaN(testDate.getTime())) {
    alert('Fecha inválida.');
    return;
  }

  aegisState.abstinence.startDate = newDateStr;
  aegisState.sobrietyStartDate = newDateStr;
  aegisState.abstinence.relapsedToday = false;
  delete aegisState.abstinence.lastRelapseDate;

  const stats = calculateAbstinenceStats();
  aegisState.abstinence.days = stats.days;
  aegisState.sobrietyDays = stats.days;

  saveMasterState();
  renderAbstinenceModule();
  updateHeaderStats();
  renderRewardsList();
  playChime(587.33, 880, 0.35);
  alert(`Racha actualizada con éxito.\nFecha de inicio: ${newDateStr}\nDías calculados: ${stats.days} (${stats.fullDays} días completos transcurridos).`);
}

function handleLogCravingEpisode() {
  const sliderAlc = document.getElementById('sliderAlcoholCraving');
  const sliderSmk = document.getElementById('sliderSmokeCraving');
  const inputCtx = document.getElementById('inputCravingContext');

  const alc = parseInt(sliderAlc ? sliderAlc.value : 1, 10);
  const smk = parseInt(sliderSmk ? sliderSmk.value : 1, 10);
  const context = inputCtx ? inputCtx.value.trim() : '';

  const nowFormatted = new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let action = '';
  if (alc >= 4 || smk >= 4) {
    action = '⚠️ ALERTA ELEVADA: Detener pantallas. 1 vaso de agua fría + 15g semillas de calabaza y 3 ciclos de respiración 4-7-8.';
  } else if (alc === 3 || smk === 3) {
    action = '⚡ Craving Moderado: Pausa de 5 minutos, salir a caminar o beber infusión sin azúcar.';
  } else {
    action = '✓ Estado Estable: Autocontrol óptimo y corteza prefrontal en control.';
  }

  if (!aegisState.abstinence.cravingHistory) aegisState.abstinence.cravingHistory = [];
  aegisState.abstinence.cravingHistory.unshift({
    timestamp: nowFormatted,
    alcohol: alc,
    smoke: smk,
    context: context || 'Monitoreo preventivo',
    action
  });

  const intBox = document.getElementById('cravingInterventionBox');
  if (intBox) {
    if (alc >= 3 || smk >= 3) {
      intBox.style.display = 'block';
      intBox.className = 'p-2 radius-sm ' + (alc >= 4 ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning');
      intBox.innerHTML = `
        <strong>💡 Dictamen Determinista Inmediato (${nowFormatted}):</strong>
        <p class="text-xs mt-1">${action}</p>
        ${alc >= 4 ? `<button class="btn btn-secondary btn-sm mt-1" onclick="triggerRelapseEmergency(${alc}, 4, 3)">Activar Protocolo de Emergencia Anti-Recaída</button>` : ''}
      `;
    } else {
      intBox.style.display = 'none';
    }
  }

  saveMasterState();
  renderAbstinenceModule();
  if (inputCtx) inputCtx.value = '';
  playChime();
  alert(`✓ Momento exacto registrado con éxito (${nowFormatted}).\n• Craving Alcohol: ${alc}/5\n• Craving Tabaco: ${smk}/5\n\n${action}`);
}

function updateCravingSliderDisplay() {
  const sliderAlc = document.getElementById('sliderAlcoholCraving');
  const sliderSmk = document.getElementById('sliderSmokeCraving');
  const valAlc = document.getElementById('valAlcoholCraving');
  const valSmk = document.getElementById('valSmokeCraving');

  const alcLabels = {
    1: '1 - Ninguno (Mente clara)',
    2: '2 - Leve (Pensamiento fugaz)',
    3: '3 - Moderado (Deseo perceptible)',
    4: '4 - Fuerte (Incomodidad)',
    5: '5 - Crítico (Riesgo inminente)'
  };
  const smkLabels = {
    1: '1 - Ninguno',
    2: '2 - Leve',
    3: '3 - Moderado',
    4: '4 - Fuerte',
    5: '5 - Crítico'
  };

  if (sliderAlc && valAlc) {
    const v = sliderAlc.value;
    valAlc.textContent = alcLabels[v] || v;
    valAlc.className = `craving-pill-val level-${v}`;
  }
  if (sliderSmk && valSmk) {
    const v = sliderSmk.value;
    valSmk.textContent = smkLabels[v] || v;
    valSmk.className = `craving-pill-val level-${v}`;
  }
}

// =============================================================================
// 5. MÓDULO 2: CONTABILIDAD (5 CUBETAS DE FLUJO)
// =============================================================================

/**
 * Partición determinista:
 * 40% Cubeta 1 (Operativos diarios): Presupuesto diario en efectivo = Total / 7
 * 20% Cubeta 2 (Mantenimiento semanal): Despensa por volumen Otzolotepec
 * 20% Cubeta 3 (Costos mensuales): Fondo intocable medicamentos/servicios
 * 10% Cubeta 4 (Inversión & Deuda): Capital semilla proyectos
 * 10% Cubeta 5 (Premios): Condicional por interruptor lógico
 */
function distributeIncome(amount, source, category) {
  if (isNaN(amount) || amount <= 0) {
    alert('Ingresa un monto válido mayor a 0.');
    return;
  }
  const cat = category || 'Ingeniería';
  const src = source || 'Ingreso recibido';

  const b1 = amount * 0.40;
  const b2 = amount * 0.20;
  const b3 = amount * 0.20;
  const b4 = amount * 0.10;
  const b5 = amount * 0.10;

  aegisState.accounting.currentMonthIncome += amount;
  aegisState.accounting.buckets.b1_daily += b1;
  aegisState.accounting.buckets.b2_weekly += b2;
  aegisState.accounting.buckets.b3_monthly += b3;
  aegisState.accounting.buckets.b4_invest += b4;
  aegisState.accounting.buckets.b5_rewards += b5;

  // Registrar en Libro Mayor
  aegisState.accounting.ledger.unshift({
    id: 'tx_' + Date.now(),
    timestamp: new Date().toISOString(),
    type: 'Ingreso',
    category: cat,
    description: src,
    bucket: 'Todas (Partición 40/20/20/10/10)',
    amount: amount
  });

  saveMasterState();
  renderAccountingModule();
  updateHeaderStats();
  playChime();
  alert(`Ingreso de $${amount.toLocaleString()} MXN [${cat}] distribuido exitosamente:\n• 40% Diario: $${b1.toFixed(2)} (Efectivo hoy: $${(b1/7).toFixed(2)})\n• 20% Semanal: $${b2.toFixed(2)}\n• 20% Mensual: $${b3.toFixed(2)}\n• 10% Inversión: $${b4.toFixed(2)}\n• 10% Premios: $${b5.toFixed(2)}`);
}

function resetBucketsToZero() {
  if (confirm('¿Confirmas reiniciar todos los saldos de las 5 cubetas a $0.00 para iniciar una auditoría limpia?')) {
    aegisState.accounting.currentMonthIncome = 0;
    aegisState.accounting.buckets = {
      b1_daily: 0,
      b2_weekly: 0,
      b3_monthly: 0,
      b4_invest: 0,
      b5_rewards: 0
    };
    saveMasterState();
    renderAccountingModule();
    updateHeaderStats();
    alert('Saldos restablecidos a $0.00 pesos.');
  }
}

function renderAccountingModule() {
  const acc = aegisState.accounting;
  const b1 = acc.buckets.b1_daily;
  const b2 = acc.buckets.b2_weekly;
  const b3 = acc.buckets.b3_monthly;
  const b4 = acc.buckets.b4_invest;
  const b5 = acc.buckets.b5_rewards;

  const b1El = document.getElementById('bucket1Balance');
  const b1CashEl = document.getElementById('bucket1DailyCash');
  const b2El = document.getElementById('bucket2Balance');
  const b3El = document.getElementById('bucket3Balance');
  const b4El = document.getElementById('bucket4Balance');
  const b5El = document.getElementById('bucket5Balance');

  if (b1El) b1El.textContent = `$${b1.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (b1CashEl) b1CashEl.textContent = `$${(b1 / 7).toLocaleString('es-MX', { minimumFractionDigits: 2 })} / día`;
  if (b2El) b2El.textContent = `$${b2.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (b3El) b3El.textContent = `$${b3.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (b4El) b4El.textContent = `$${b4.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (b5El) b5El.textContent = `$${b5.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  // Renderizar proyectos de inversión desglosados y clickeables
  renderInvestmentProjectsList();

  // Renderizar premios con validación de datos reales
  renderRewardsList();

  // Renderizar Libro Mayor de los últimos 7 días
  renderGeneralLedger();
}

function renderGeneralLedger() {
  const ledger = aegisState.accounting.ledger || [];
  const tbody = document.getElementById('ledgerTableBody');
  const badgeInc = document.getElementById('ledgerIncome7dBadge');
  const badgeExp = document.getElementById('ledgerExpense7dBadge');
  const badgeNet = document.getElementById('ledgerNet7dBadge');
  if (!tbody) return;

  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentTxs = ledger.filter(tx => new Date(tx.timestamp).getTime() >= sevenDaysAgo);

  let totalInc = 0;
  let totalExp = 0;

  if (recentTxs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 1.5rem;">Sin transacciones en los últimos 7 días. Registra ingresos o egresos para ver el desglose determinista.</td></tr>`;
  } else {
    tbody.innerHTML = recentTxs.map(tx => {
      const isInc = tx.type === 'Ingreso';
      if (isInc) totalInc += tx.amount;
      else totalExp += tx.amount;

      const dateObj = new Date(tx.timestamp);
      const dateFormatted = `${dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} ${dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

      return `
        <tr>
          <td><strong>${dateFormatted}</strong></td>
          <td><span class="${isInc ? 'badge-income' : 'badge-expense'}">${isInc ? '+ Ingreso' : '- Egreso'}</span></td>
          <td><span class="badge-pill">${tx.category}</span></td>
          <td>${tx.description || '-'}</td>
          <td><small class="text-muted">${tx.bucket || '-'}</small></td>
          <td class="text-right font-bold ${isInc ? 'text-success' : 'text-danger'}">
            ${isInc ? '+' : '-'}$${tx.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
        </tr>
      `;
    }).join('');
  }

  const net = totalInc - totalExp;
  if (badgeInc) badgeInc.textContent = `Ingresos 7d: $${totalInc.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (badgeExp) badgeExp.textContent = `Egresos 7d: $${totalExp.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  if (badgeNet) {
    badgeNet.textContent = `Balance Neto: ${net >= 0 ? '+' : ''}$${net.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    badgeNet.className = `status-badge ${net >= 0 ? 'success' : 'danger'}`;
  }
}

// Proyectos de Inversión con Componentes Desglosados y Editables
function addProjectComponentRow(containerId, comp = { name: '', price: 0 }) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'comp-item-row';
  row.innerHTML = `
    <input type="text" class="input-control comp-name-input" placeholder="Nombre componente/insumo" value="${comp.name}">
    <input type="number" class="input-control comp-price-input" placeholder="$ 0.00" value="${comp.price || ''}" min="0">
    <button type="button" class="btn btn-outline text-danger btn-sm btn-del-comp-row" title="Eliminar insumo">✕</button>
  `;
  row.querySelector('.btn-del-comp-row').addEventListener('click', () => {
    row.remove();
    recalcProjectModalTotal(containerId);
  });
  row.querySelector('.comp-price-input').addEventListener('input', () => {
    recalcProjectModalTotal(containerId);
  });
  container.appendChild(row);
  recalcProjectModalTotal(containerId);
}

function recalcProjectModalTotal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return 0;
  let total = 0;
  container.querySelectorAll('.comp-price-input').forEach(inp => {
    const v = parseFloat(inp.value) || 0;
    total += v;
  });
  const displayId = containerId === 'npComponentsRowsContainer' ? 'npTotalCostDisplay' : 'epTotalCostDisplay';
  const disp = document.getElementById(displayId);
  if (disp) disp.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  return total;
}

function renderInvestmentProjectsList() {
  const pList = document.getElementById('investProjectsList');
  if (!pList) return;
  const projects = aegisState.accounting.investmentProjects || [];

  if (projects.length === 0) {
    pList.innerHTML = `<p class="text-sm text-muted">No hay proyectos de inversión. Pulsa "+ Nuevo Proyecto" para desglosar insumos.</p>`;
    return;
  }

  pList.innerHTML = projects.map(p => {
    const cost = p.totalCost || (p.components ? p.components.reduce((sum, c) => sum + (parseFloat(c.price)||0), 0) : p.cost || 0);
    const compCount = p.components ? p.components.length : 0;
    const statusClass = p.status === 'terminado' ? 'success' : p.status === 'en proceso' ? 'primary' : 'warn';

    return `
      <div class="project-clickable-card" onclick="openEditProjectModal('${p.id}')">
        <div>
          <strong>${p.name}</strong>
          <span class="status-badge ${statusClass}" style="margin-left: 0.5rem;">${p.status || 'en proceso'}</span>
          <div class="text-xs text-muted mt-1">
            Costo Total: <strong>$${cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong> • Retorno: ${p.returnTime || 'Por definir'}
          </div>
          <div class="text-xs text-muted">
            ${compCount > 0 ? `📦 ${compCount} componentes/insumos desglosados (Clic para editar)` : 'Clic para agregar componentes'}
          </div>
        </div>
        <div class="text-right">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openEditProjectModal('${p.id}')">Editar ✏️</button>
        </div>
      </div>
    `;
  }).join('');
}

window.openEditProjectModal = function(projectId) {
  const p = aegisState.accounting.investmentProjects.find(item => item.id === projectId);
  if (!p) return;
  document.getElementById('epProjectId').value = p.id;
  document.getElementById('epName').value = p.name;
  document.getElementById('epRoiTime').value = p.returnTime || '3 semanas';
  document.getElementById('epStatusSelect').value = p.status || 'en proceso';

  const container = document.getElementById('epComponentsRowsContainer');
  container.innerHTML = '';
  if (p.components && p.components.length > 0) {
    p.components.forEach(c => addProjectComponentRow('epComponentsRowsContainer', c));
  } else {
    addProjectComponentRow('epComponentsRowsContainer', { name: 'Insumo inicial', price: p.cost || 0 });
  }
  recalcProjectModalTotal('epComponentsRowsContainer');
  openModal('editProjectModal');
};

function saveEditProject() {
  const id = document.getElementById('epProjectId').value;
  const p = aegisState.accounting.investmentProjects.find(item => item.id === id);
  if (!p) return;

  p.name = document.getElementById('epName').value || p.name;
  p.returnTime = document.getElementById('epRoiTime').value || p.returnTime;
  p.status = document.getElementById('epStatusSelect').value || 'en proceso';

  const components = [];
  let totalCost = 0;
  document.querySelectorAll('#epComponentsRowsContainer .comp-item-row').forEach(row => {
    const name = row.querySelector('.comp-name-input').value.trim();
    const price = parseFloat(row.querySelector('.comp-price-input').value) || 0;
    if (name || price > 0) {
      components.push({ id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 5), name: name || 'Insumo', price });
      totalCost += price;
    }
  });

  p.components = components;
  p.totalCost = totalCost;
  p.cost = totalCost;

  saveMasterState();
  renderAccountingModule();
  closeModal('editProjectModal');
  alert('Proyecto de inversión actualizado con éxito.');
}

function deleteProject(id) {
  if (confirm('¿Confirmas eliminar este proyecto de inversión?')) {
    aegisState.accounting.investmentProjects = aegisState.accounting.investmentProjects.filter(item => item.id !== id);
    saveMasterState();
    renderAccountingModule();
    closeModal('editProjectModal');
  }
}

// Premios Auditados con Validación de Datos Reales
function renderRewardsList() {
  const rList = document.getElementById('rewardsList');
  if (!rList) return;
  const acc = aegisState.accounting;
  const curSober = (aegisState.abstinence && aegisState.abstinence.days !== undefined) ? aegisState.abstinence.days : (aegisState.sobrietyDays || 1);
  const curWeight = aegisState.userProfile.weight;
  const curRewardsCash = acc.buckets.b5_rewards;
  const todayStr = new Date().toISOString().split('T')[0];

  if (!acc.rewards || acc.rewards.length === 0) {
    rList.innerHTML = `<p class="text-sm text-muted">Sin premios configurados. Pulsa "+ Nuevo Premio" para definir una meta auditable.</p>`;
    return;
  }

  rList.innerHTML = acc.rewards.map(r => {
    const soberReq = r.soberDays || 30;
    const weightReq = r.weightTarget || 74.0;
    const moneyReq = r.money || 2500;
    const deadline = r.deadline || '2026-11-01';

    const soberOk = curSober >= soberReq;
    const weightOk = curWeight <= weightReq;
    const moneyOk = curRewardsCash >= moneyReq;
    const timeOk = !deadline || todayStr <= deadline;

    const allConditionsMet = soberOk && weightOk && moneyOk && timeOk;
    const isClaimed = r.status === 'claimed';
    const isFailed = r.status === 'failed';

    return `
      <div class="reward-item-card" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <strong>🎁 ${r.name}</strong>
            <span class="status-badge ${isClaimed ? 'success' : isFailed ? 'danger' : 'warn'}">${isClaimed ? 'Cobrado' : isFailed ? 'Fallido' : 'Pendiente'}</span>
            <div class="text-xs text-muted mt-1">Costo: $${moneyReq.toLocaleString()} MXN • Límite: ${deadline}</div>
          </div>
          <div class="btn-group">
            ${!isClaimed && !isFailed ? `
              <button class="btn btn-primary btn-sm" ${allConditionsMet ? '' : 'disabled'} onclick="claimReward('${r.id}')" title="${allConditionsMet ? 'Cumples todos los requisitos' : 'Faltan requisitos en tus datos reales'}">
                Cobrar ($${moneyReq.toLocaleString()})
              </button>
              <button class="btn btn-outline btn-sm text-danger" onclick="failReward('${r.id}')" title="Transfiere fondos automáticamente a Inversión">
                Declarar Fallo
              </button>
            ` : `
              <span class="text-xs text-muted">${isClaimed ? '✓ Recompensa cobrada' : 'Penalizado -> Inversión'}</span>
            `}
          </div>
        </div>

        <div class="reward-criteria-grid">
          <div class="crit-pill ${soberOk ? 'ok' : 'fail'}">
            <span>🛡️ Abstinencia:</span>
            <strong>${curSober} / ${soberReq} días ${soberOk ? '✓' : '✗'}</strong>
          </div>
          <div class="crit-pill ${weightOk ? 'ok' : 'fail'}">
            <span>⚖️ Peso corporal:</span>
            <strong>${curWeight.toFixed(1)} / ${weightReq} kg ${weightOk ? '✓' : '✗'}</strong>
          </div>
          <div class="crit-pill ${moneyOk ? 'ok' : 'fail'}">
            <span>💰 Saldo Cubeta 5:</span>
            <strong>$${curRewardsCash.toFixed(0)} / $${moneyReq} ${moneyOk ? '✓' : '✗'}</strong>
          </div>
          <div class="crit-pill ${timeOk ? 'ok' : 'fail'}">
            <span>📅 Plazo Límite:</span>
            <strong>${timeOk ? 'En plazo ✓' : 'Vencido ✗'}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.claimReward = function(id) {
  const r = aegisState.accounting.rewards.find(item => item.id === id);
  if (!r) return;
  if (aegisState.accounting.buckets.b5_rewards < r.money) {
    alert(`Fondos insuficientes en la Cubeta 5 ($${aegisState.accounting.buckets.b5_rewards.toFixed(2)} de $${r.money}).`);
    return;
  }
  if (confirm(`¿Confirmas el cobro del premio "${r.name}" por $${r.money.toLocaleString()} MXN? Se verificaron todas las condiciones biométricas y financieras en datos duros.`)) {
    aegisState.accounting.buckets.b5_rewards -= r.money;
    
    // Registrar en Ledger
    aegisState.accounting.ledger.unshift({
      id: 'tx_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'Egreso',
      category: 'Premios',
      description: `Cobro de premio: ${r.name}`,
      bucket: 'Cubeta 5 (Premios)',
      amount: r.money
    });

    // Según especificación: una vez cobrado se borra ese apartado
    aegisState.accounting.rewards = aegisState.accounting.rewards.filter(item => item.id !== id);

    saveMasterState();
    renderAccountingModule();
    alert('¡Premio cobrado con honor! Bien merecido por tu disciplina. El apartado del premio ha sido retirado.');
  }
};

window.failReward = function(id) {
  const r = aegisState.accounting.rewards.find(item => item.id === id);
  if (!r) return;
  if (confirm(`Interruptor Lógico Determinista: Al declarar incumplimiento, los fondos de este premio ($${r.money}) o el saldo disponible se transferirán irrevocablemente a la Cubeta de Inversión y Liquidación de Deuda. ¿Confirmar penalización?`)) {
    const transferAmount = Math.min(aegisState.accounting.buckets.b5_rewards, r.money);
    if (transferAmount > 0) {
      aegisState.accounting.buckets.b5_rewards -= transferAmount;
      aegisState.accounting.buckets.b4_invest += transferAmount;
      aegisState.accounting.ledger.unshift({
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'Ingreso',
        category: 'Inversión',
        description: `Penalización de premio no cumplido: ${r.name} -> Transferencia a Inversión`,
        bucket: 'Cubeta 4 (Inversión)',
        amount: transferAmount
      });
    }

    // Según especificación: una vez declarado como fallo se borra ese apartado
    aegisState.accounting.rewards = aegisState.accounting.rewards.filter(item => item.id !== id);

    saveMasterState();
    renderAccountingModule();
    alert(`Regla ejecutada: $${transferAmount.toFixed(2)} transferidos a Inversión & Deuda. El apartado del premio ha sido retirado.`);
  }
};

// =============================================================================
// 6. MÓDULO 3: NUTRICIÓN, DESPENSA OTZOLOTEPEC & MIFFLIN ST. JEOR
// =============================================================================

function calculateAge(birthdateStr) {
  const dob = new Date(birthdateStr);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function calculateMifflinStJeor() {
  const prof = aegisState.userProfile;
  const age = calculateAge(prof.birthdate);
  const w = parseFloat(prof.weight) || 74.5;
  const h = parseFloat(prof.height) || 175;
  const act = parseFloat(prof.activityFactor) || 1.2;

  let bmr = (10 * w) + (6.25 * h) - (5 * age);
  if (prof.gender === 'male') bmr += 5;
  else bmr -= 161;

  const tdee = Math.round(bmr * act);

  // 50% Carbohidratos, 25% Proteínas, 25% Grasas
  const carbsCals = Math.round(tdee * 0.50);
  const carbsGrams = Math.round(carbsCals / 4);
  const protCals = Math.round(tdee * 0.25);
  const protGrams = Math.round(protCals / 4);
  const fatCals = Math.round(tdee * 0.25);
  const fatGrams = Math.round(fatCals / 9);

  return { age, bmr: Math.round(bmr), tdee, carbsGrams, carbsCals, protGrams, protCals, fatGrams, fatCals };
}

function renderNutritionModule() {
  const calc = calculateMifflinStJeor();

  const ageEl = document.getElementById('calculatedAgeDisplay');
  const bmrEl = document.getElementById('bmrValue');
  const tdeeEl = document.getElementById('tdeeValue');
  const cgEl = document.getElementById('carbGrams');
  const ccEl = document.getElementById('carbCals');
  const pgEl = document.getElementById('protGrams');
  const pcEl = document.getElementById('protCals');
  const fgEl = document.getElementById('fatGrams');
  const fcEl = document.getElementById('fatCals');

  if (ageEl) ageEl.textContent = `${calc.age} años`;
  if (bmrEl) bmrEl.textContent = `${calc.bmr} kcal`;
  if (tdeeEl) tdeeEl.textContent = `${calc.tdee} kcal`;
  if (cgEl) cgEl.textContent = `${calc.carbsGrams} g`;
  if (ccEl) ccEl.textContent = `${calc.carbsCals} kcal`;
  if (pgEl) pgEl.textContent = `${calc.protGrams} g`;
  if (pcEl) pcEl.textContent = `${calc.protCals} kcal`;
  if (fgEl) fgEl.textContent = `${calc.fatGrams} g`;
  if (fcEl) fcEl.textContent = `${calc.fatCals} kcal`;

  // Renderizar despensa semanal de Otzolotepec
  const pGrid = document.getElementById('pantryInventoryGrid');
  if (pGrid && aegisState.nutrition.pantryInventory) {
    pGrid.innerHTML = aegisState.nutrition.pantryInventory.map(item => `
      <div class="pantry-card-item">
        <div>
          <strong>${item.name}</strong>
          <div class="text-xs text-muted">Stock: ${item.qty} ${item.unit} ($${item.price})</div>
        </div>
        <div class="text-right">
          <span class="status-badge success">${item.dailyPortion}</span>
        </div>
      </div>
    `).join('');
  }

  // Llenar selectores del comparador nutricional
  populateNutriComparator();

  // Renderizar cronograma de comidas y medicación
  renderMealSchedule();
}

const OTZOLOTEPEC_NUTRI_DB = {
  'Calabacita criolla': { protein: 2.0, fiber: 2.5, vitamins: 8, gi: 15, defaultPrice: 18 },
  'Zanahoria fresca': { protein: 0.9, fiber: 2.8, vitamins: 9, gi: 35, defaultPrice: 18 },
  'Nopal tierno': { protein: 1.4, fiber: 3.5, vitamins: 8.5, gi: 10, defaultPrice: 15 },
  'Espinaca local': { protein: 2.9, fiber: 2.2, vitamins: 9.5, gi: 15, defaultPrice: 20 },
  'Haba verde fresca': { protein: 7.9, fiber: 5.4, vitamins: 8.0, gi: 30, defaultPrice: 35 },
  'Trucha de presa': { protein: 20.5, fiber: 0, vitamins: 9.0, gi: 0, defaultPrice: 120 },
  'Pechuga de pollo': { protein: 23.0, fiber: 0, vitamins: 7.5, gi: 0, defaultPrice: 110 },
  'Papa blanca': { protein: 2.0, fiber: 2.1, vitamins: 6.0, gi: 65, defaultPrice: 22 }
};

function populateNutriComparator() {
  const selA = document.getElementById('compFoodA');
  const selB = document.getElementById('compFoodB');
  if (!selA || !selB) return;

  const keys = Object.keys(OTZOLOTEPEC_NUTRI_DB);
  if (!selA.options || selA.options.length === 0) {
    selA.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
    selB.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
    selB.selectedIndex = 1;
  }
}

function runNutriCompare() {
  const fA = document.getElementById('compFoodA').value;
  const fB = document.getElementById('compFoodB').value;
  const pA = parseFloat(document.getElementById('compPriceA').value) || 18;
  const pB = parseFloat(document.getElementById('compPriceB').value) || 18;

  const dataA = OTZOLOTEPEC_NUTRI_DB[fA];
  const dataB = OTZOLOTEPEC_NUTRI_DB[fB];

  // Fórmula determinista de densidad de nutrientes:
  // Densidad = (Proteína * 3 + Fibra * 2.5 + Micronutrientes * 1.5) / (GI + 5)
  const densA = ((dataA.protein * 3) + (dataA.fiber * 2.5) + (dataA.vitamins * 1.5)) / (dataA.gi + 5);
  const densB = ((dataB.protein * 3) + (dataB.fiber * 2.5) + (dataB.vitamins * 1.5)) / (dataB.gi + 5);

  const valueA = (densA / pA) * 100;
  const valueB = (densB / pB) * 100;

  const resBox = document.getElementById('compareResultBox');
  resBox.style.display = 'block';

  let verdict = '';
  if (valueA > valueB) {
    verdict = `<strong>Dictamen:</strong> Compra recomendada: <strong>${fA}</strong>. Ofrece un <strong>${Math.round((valueA / valueB - 1) * 100)}% más de densidad nutricional por cada peso gastado</strong>, menor impacto glucémico y mayor índice de saciedad para mitigar hambre.`;
  } else {
    verdict = `<strong>Dictamen:</strong> Compra recomendada: <strong>${fB}</strong>. Ofrece un <strong>${Math.round((valueB / valueA - 1) * 100)}% más de rendimiento nutricional por cada peso invertido</strong> con excelente perfil de micronutrientes.`;
  }

  resBox.innerHTML = `
    <div class="font-bold mb-1">📊 Análisis Determinista Costo / Calidad Biológica:</div>
    <div>• <strong>${fA}</strong> ($${pA}/kg): Índice de Densidad = ${densA.toFixed(2)} | Rendimiento/Precio = <strong>${valueA.toFixed(1)} pts</strong></div>
    <div>• <strong>${fB}</strong> ($${pB}/kg): Índice de Densidad = ${densB.toFixed(2)} | Rendimiento/Precio = <strong>${valueB.toFixed(1)} pts</strong></div>
    <div class="mt-2 text-primary">${verdict}</div>
  `;
}

// Generador de Lista de Compra Dominical de Otzolotepec (Optimizada para Colesterol/Grasa & Masa Muscular)
const SUNDAY_OTZOLOTEPEC_LIST = [
  { name: 'Nopales tiernos de milpa', qty: 2.0, unit: 'kg', price: 25, cat: 'veg', target: 'cholesterol', targetDesc: 'Fibra soluble y mucílago para reducir colesterol LDL y regular glucosa.' },
  { name: 'Calabacitas criollas de Otzolotepec', qty: 2.0, unit: 'kg', price: 36, cat: 'veg', target: 'cholesterol', targetDesc: 'Baja densidad calórica, volumen y luteína sin pico glucémico.' },
  { name: 'Espinacas y quelites locales', qty: 3, unit: 'manojos', price: 30, cat: 'veg', target: 'cholesterol', targetDesc: 'Nitratos endoteliales, hierro y folatos para oxigenación tisular.' },
  { name: 'Jitomate guaje y cebolla morada', qty: 2.0, unit: 'kg', price: 35, cat: 'veg', target: 'cholesterol', targetDesc: 'Licopeno y quercetina cardioprotectora anti-inflamatoria.' },
  { name: 'Pechuga de pollo fresca de granja', qty: 2.0, unit: 'kg', price: 220, cat: 'protein', target: 'muscle', targetDesc: '23g proteína magra/100g, alta leucina para translocación y BDNF.' },
  { name: 'Huevos de rancho orgánicos', qty: 1.5, unit: 'kg (~24pz)', price: 60, cat: 'protein', target: 'muscle', targetDesc: 'Patrón oro de aminoácidos esenciales y colina cerebral.' },
  { name: 'Aguacate criollo local', qty: 1.0, unit: 'kg', price: 45, cat: 'fat', target: 'cholesterol', targetDesc: 'Ácido oleico y fitoesteroles reductores de LDL.' },
  { name: 'Avena integral en hojuelas', qty: 1.0, unit: 'kg', price: 24, cat: 'carb', target: 'cholesterol', targetDesc: 'Betaglucanos para barrer colesterol biliar y energía lenta.' },
  { name: 'Semillas de calabaza sin sal', qty: 0.3, unit: 'kg', price: 35, cat: 'fat', target: 'muscle', targetDesc: 'Zinc, magnesio y triptófano anti-ansiedad.' },
  { name: 'Manzanas perón criollas', qty: 1.5, unit: 'kg', price: 40, cat: 'fruit', target: 'energy', targetDesc: 'Pectina saciante para snack de rescate de las 16:00.' }
];

function generateSundayShoppingList() {
  const container = document.getElementById('sundayListContainer');
  const itemsList = document.getElementById('sundayItemsList');
  const totalCostEl = document.getElementById('sundayTotalCost');
  if (!container || !itemsList) return;

  const total = SUNDAY_OTZOLOTEPEC_LIST.reduce((sum, item) => sum + item.price, 0);
  itemsList.innerHTML = SUNDAY_OTZOLOTEPEC_LIST.map(item => `
    <div class="sunday-item-row">
      <div>
        <strong>${item.name}</strong> (${item.qty} ${item.unit})
        <div class="text-xs text-muted">${item.targetDesc}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="market-tag ${item.target}">${item.target === 'cholesterol' ? 'Baja Colesterol' : item.target === 'muscle' ? 'Masa Muscular' : 'Energía'}</span>
        <strong style="font-family: var(--font-mono); font-size: 0.85rem;">$${item.price.toFixed(2)}</strong>
      </div>
    </div>
  `).join('');

  if (totalCostEl) totalCostEl.textContent = `$${total.toFixed(2)} MXN`;
  container.style.display = 'block';
}

function applySundayShopping() {
  const total = SUNDAY_OTZOLOTEPEC_LIST.reduce((sum, item) => sum + item.price, 0);
  SUNDAY_OTZOLOTEPEC_LIST.forEach(item => {
    const dailyPortion = item.unit.includes('kg') ? `${Math.round(item.qty * 1000 / 7)}g/día` : `${(item.qty / 7).toFixed(1)}/día`;
    aegisState.nutrition.pantryInventory.unshift({
      id: 'pi_' + Date.now() + Math.random().toString(36).substring(2, 5),
      name: item.name,
      qty: item.qty,
      unit: item.unit,
      price: item.price,
      cat: item.cat,
      dailyPortion
    });
  });

  if (aegisState.accounting.buckets.b2_weekly >= total) {
    aegisState.accounting.buckets.b2_weekly -= total;
  }
  aegisState.accounting.ledger.unshift({
    id: 'tx_' + Date.now(),
    timestamp: new Date().toISOString(),
    type: 'Egreso',
    category: 'Comida',
    description: 'Despensa dominical Otzolotepec (Baja grasa/colesterol & masa muscular)',
    bucket: 'Cubeta 2 (Semanal)',
    amount: total
  });

  saveMasterState();
  renderNutritionModule();
  renderAccountingModule();
  alert(`✓ Lista dominical integrada exitosamente a la despensa.\n• 10 alimentos agregados con porcionamiento exacto para 7 días.\n• $${total.toFixed(2)} MXN registrados en Cubeta 2 y Libro Mayor.`);
}

function renderMealSchedule() {
  const container = document.getElementById('mealsTimelineContainer');
  if (!container) return;

  const schedule = aegisState.nutrition.mealSchedule || [];
  container.innerHTML = schedule.map((meal, idx) => `
    <div class="chrono-item ${meal.consumed ? 'bg-success-subtle' : ''}">
      <span class="chrono-time">${meal.time}</span>
      <div class="chrono-desc" style="flex: 1;">
        <strong>${meal.title}</strong>
        <p>${meal.desc}</p>
        ${meal.consumed ? `<span class="badge-pill bg-success-subtle text-success text-xs mt-1">✓ Consumido a las ${meal.consumedTime}</span>` : ''}
        ${meal.time === '07:00' ? `<div class="clinical-note mt-1 text-xs">⚠️ <strong>Interacción Fármaco-Nutriente:</strong> Lisdexanfetamina requiere proteína magra (huevos/claras) para síntesis dopaminérgica. <strong>Evita jugos cítricos o harinas refinadas</strong> para prevenir alteraciones de pH y desplomes de glucosa a media mañana.</div>` : ''}
        ${meal.time === '13:00' ? `<div class="clinical-note mt-1 text-xs">💡 <strong>Interacción Fármaco-Nutriente:</strong> Sertralina y Bupropión deben tomarse estrictamente junto con el almuerzo principal para mitigar cualquier irritación gastrointestinal o náusea.</div>` : ''}
        ${meal.time === '16:00' ? `<div class="clinical-note mt-1 text-xs">🚫 <strong>Interacción Crítica:</strong> Cero toronja / jugo de toronja con Alprazolam (la inhibición del citocromo CYP3A4 dispara la concentración sérica).</div>` : ''}
      </div>
      <div>
        <input type="checkbox" ${meal.consumed ? 'checked' : ''} onchange="toggleMealConsumed(${idx})" class="task-checkbox" title="Marcar alimento consumido">
      </div>
    </div>
  `).join('');
}

window.toggleMealConsumed = function(idx) {
  const meal = aegisState.nutrition.mealSchedule[idx];
  meal.consumed = !meal.consumed;
  if (meal.consumed) {
    meal.consumedTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } else {
    meal.consumedTime = '';
  }
  saveMasterState();
  renderMealSchedule();
};

function registerHungerEpisode() {
  const intensity = parseInt(document.getElementById('hungerIntensityRange').value, 10);
  const type = document.getElementById('hungerType').value;
  const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  let advice = '';
  if (type === 'Craving' || intensity >= 4) {
    advice = 'Opción anti-craving determinista: 1 vaso grande de agua con 1 cucharada sopera de semillas de calabaza (15g) o rodajas de pepino con sal y limón. No consumir azúcares simples.';
  } else {
    advice = 'Opción saciante de bajo impacto: Bastones crujientes de apio o calabacita cruda con limón y pimienta.';
  }

  aegisState.nutrition.hungerHistoryToday.push({ time, intensity, type, advice });
  saveMasterState();

  const countEl = document.getElementById('hungerCountToday');
  const alertEl = document.getElementById('calorieAlertBadge');
  const adviceBox = document.getElementById('hungerAdviceBox');

  if (countEl) countEl.textContent = aegisState.nutrition.hungerHistoryToday.length;
  if (adviceBox) {
    adviceBox.style.display = 'block';
    adviceBox.innerHTML = `💡 <strong>Respuesta al apetito de las ${time}:</strong> ${advice}`;
  }

  if (aegisState.nutrition.hungerHistoryToday.length > 4) {
    if (alertEl) {
      alertEl.className = 'status-badge danger';
      alertEl.textContent = 'Alerta: Límite Calórico en Riesgo';
    }
  }
}

// =============================================================================
// 7. MÓDULO 4: MEDICACIÓN & FARMACOCINÉTICA ("BARRA DE VIDA")
// =============================================================================

function renderMedicationModule() {
  const med = aegisState.medication;
  const container = document.getElementById('medicationBlocksContainer');
  if (!container) return;

  const blocks = ['07:00', '13:00', '16:00', '20:00'];
  container.innerHTML = blocks.map(b => {
    const medsInBlock = med.medsList.filter(m => m.timeBlock === b);
    const taken = med.takenBlocksToday[b] || false;
    const takenTime = med.takenTimes && med.takenTimes[b] ? `(Tomado a las ${med.takenTimes[b]})` : '';

    return `
      <div class="med-block-card">
        <div class="med-block-header">
          <div>
            <span class="med-time-tag">${b}</span>
            <small class="text-muted" style="margin-left: 0.5rem;">${takenTime}</small>
          </div>
          <label class="check-label">
            <input type="checkbox" ${taken ? 'checked' : ''} onchange="toggleMedBlockTaken('${b}')">
            <span>${taken ? '✓ Toma Registrada' : 'Marcar Toma'}</span>
          </label>
        </div>
        <div class="med-items-list mt-1">
          ${medsInBlock.length === 0 ? '<p class="text-xs text-muted">Sin medicamentos configurados en este bloque.</p>' : medsInBlock.map(m => `
            <div class="med-item-row">
              <div>
                <strong>${m.name}</strong> <span class="badge-pill">${m.dose}</span>
                <div class="text-xs text-muted">${m.role} • Tmax: ${m.tmax}h / t½: ${m.halflife}h</div>
              </div>
              <div class="med-actions">
                <button class="med-action-btn" onclick="openEditMedModal('${m.id}')" title="Modificar dosis u horario">✏️</button>
                <button class="med-action-btn delete" onclick="deleteMedication('${m.id}')" title="Eliminar medicamento">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Simulación Farmacocinética de "Barra de Vida"
  calculateAndRenderPharmacokinetics();
}

window.toggleMedBlockTaken = function(block) {
  if (!aegisState.medication.takenBlocksToday) aegisState.medication.takenBlocksToday = {};
  if (!aegisState.medication.takenTimes) aegisState.medication.takenTimes = {};

  const isCurrentlyTaken = aegisState.medication.takenBlocksToday[block];
  if (!isCurrentlyTaken) {
    const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    aegisState.medication.takenBlocksToday[block] = true;
    aegisState.medication.takenTimes[block] = nowStr;
  } else {
    aegisState.medication.takenBlocksToday[block] = false;
    delete aegisState.medication.takenTimes[block];
  }
  saveMasterState();
  renderMedicationModule();
};

window.openEditMedModal = function(id) {
  const m = aegisState.medication.medsList.find(item => item.id === id);
  if (!m) return;
  document.getElementById('emMedId').value = m.id;
  document.getElementById('emName').value = m.name;
  document.getElementById('emDose').value = m.dose;
  document.getElementById('emTimeBlock').value = m.timeBlock;
  document.getElementById('emTmax').value = m.tmax;
  document.getElementById('emHalflife').value = m.halflife;
  document.getElementById('emRole').value = m.role;
  openModal('editMedModal');
};

window.deleteMedication = function(id) {
  if (confirm('¿Confirmas eliminar este medicamento de tu esquema diario?')) {
    aegisState.medication.medsList = aegisState.medication.medsList.filter(item => item.id !== id);
    saveMasterState();
    renderMedicationModule();
  }
};

function saveNewMed() {
  const name = document.getElementById('nmName').value.trim();
  const dose = document.getElementById('nmDose').value.trim();
  const timeBlock = document.getElementById('nmTimeBlock').value;
  const tmax = parseFloat(document.getElementById('nmTmax').value) || 3.0;
  const halflife = parseFloat(document.getElementById('nmHalflife').value) || 12.0;
  const role = document.getElementById('nmRole').value.trim() || 'Modulación terapéutica';

  if (!name || !dose) {
    alert('Ingresa al menos el nombre y la dosis del medicamento.');
    return;
  }

  aegisState.medication.medsList.push({
    id: 'm_' + Date.now(),
    name, dose, timeBlock, tmax, halflife, role
  });

  saveMasterState();
  renderMedicationModule();
  closeModal('newMedModal');
  document.getElementById('nmName').value = '';
  document.getElementById('nmDose').value = '';
  document.getElementById('nmRole').value = '';
  alert('Nuevo medicamento agregado a los bloques de horario.');
}

function saveEditMed() {
  const id = document.getElementById('emMedId').value;
  const m = aegisState.medication.medsList.find(item => item.id === id);
  if (!m) return;

  m.name = document.getElementById('emName').value.trim() || m.name;
  m.dose = document.getElementById('emDose').value.trim() || m.dose;
  m.timeBlock = document.getElementById('emTimeBlock').value || m.timeBlock;
  m.tmax = parseFloat(document.getElementById('emTmax').value) || m.tmax;
  m.halflife = parseFloat(document.getElementById('emHalflife').value) || m.halflife;
  m.role = document.getElementById('emRole').value.trim() || m.role;

  saveMasterState();
  renderMedicationModule();
  closeModal('editMedModal');
  alert('Medicamento actualizado.');
}

function calculateAndRenderPharmacokinetics() {
  const now = new Date();
  const currentHour = now.getHours() + (now.getMinutes() / 60);
  const prof = aegisState.userProfile;
  const w = parseFloat(prof.weight) || 74.5;
  const age = calculateAge(prof.birthdate);
  
  // Factor farmacocinético determinista ajustado por peso, edad y sexo
  const clearanceFactor = (w / 70) * (age < 30 ? 1.05 : 0.95);

  const container = document.getElementById('pkDrugBarsContainer');
  if (!container) return;

  const medList = aegisState.medication.medsList || [];
  let totalConcSum = 0;
  let activeDrugCount = 0;

  const drugBarsHtml = medList.map(m => {
    let intakeHour = 7.0;
    if (m.timeBlock === '13:00') intakeHour = 13.0;
    else if (m.timeBlock === '16:00') intakeHour = 16.0;
    else if (m.timeBlock === '20:00') intakeHour = 20.0;

    const blockTimeStr = aegisState.medication.takenTimes && aegisState.medication.takenTimes[m.timeBlock];
    if (blockTimeStr) {
      const parts = blockTimeStr.split(':');
      intakeHour = parseInt(parts[0], 10) + (parseInt(parts[1], 10) / 60);
    }

    const dt = currentHour - intakeHour;
    let conc = 0;
    let phase = 'Pre-toma / Inactivo';

    if (dt >= 0 && dt <= 24) {
      activeDrugCount++;
      if (dt <= m.tmax) {
        conc = (dt / m.tmax) * 100;
        phase = 'Absorción (Subiendo)';
      } else {
        const adjustedHalfLife = m.halflife * clearanceFactor;
        conc = 100 * Math.pow(0.5, (dt - m.tmax) / adjustedHalfLife);
        phase = conc > 50 ? 'Pico Terapéutico' : 'Eliminación Activa';
      }
    }
    conc = Math.max(0, Math.min(100, Math.round(conc)));
    totalConcSum += conc;

    return `
      <div class="pk-drug-item">
        <div class="pk-drug-row">
          <span><strong>${m.name}</strong> (${m.dose}) - <small class="text-muted">${phase}</small>:</span>
          <strong>${conc}%</strong>
        </div>
        <div class="pk-mini-bar">
          <div class="pk-mini-fill" style="width: ${conc}%; background: ${conc > 60 ? 'var(--primary)' : conc > 25 ? 'var(--accent)' : 'var(--border-color)'};"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = drugBarsHtml;

  const globalAvg = activeDrugCount > 0 ? Math.round(totalConcSum / activeDrugCount) : 0;
  const gBar = document.getElementById('pkGlobalLifeBar');
  const gText = document.getElementById('pkGlobalStatusVal');
  if (gBar) gBar.style.width = `${Math.max(5, globalAvg)}%`;
  if (gText) gText.textContent = `Nivel Plasmático Promedio: ${globalAvg}% (${globalAvg > 60 ? 'Ventana Terapéutica Óptima' : globalAvg > 25 ? 'Fase Estable' : 'Fase Basal'})`;
}

// =============================================================================
// 8. MÓDULO 5: EJERCICIO, RODILLA & BDNF
// =============================================================================

function renderExerciseModule() {
  const ex = aegisState.exercise;
  const rContainer = document.getElementById('dailyRoutineContainer');
  if (rContainer) {
    rContainer.innerHTML = ex.routineExercises.map((r, i) => `
      <div class="step-card">
        <span class="step-num">${i + 1}</span>
        <div>
          <strong>${r.name}</strong> <span class="text-xs text-primary font-bold">(${r.time})</span>
          <p class="text-xs text-muted">${r.desc}</p>
        </div>
      </div>
    `).join('');
  }

  checkExerciseUnlocks();
}

function checkExerciseUnlocks() {
  const ex = aegisState.exercise;
  const currentWeight = aegisState.userProfile.weight;

  const wOk = currentWeight <= 75.0;
  const kOk = ex.consecutiveNoPainDays >= 30;
  const sOk = ex.completedSessions >= 25;

  const wEl = document.getElementById('critWeight');
  const kEl = document.getElementById('critKneeDays');
  const sEl = document.getElementById('critSessions');

  if (wEl) wEl.innerHTML = `<span class="crit-bullet">${wOk ? '✅' : '⚪'}</span> Peso $\\le 75.0$ kg (Actual: <strong>${currentWeight.toFixed(1)} kg</strong>)`;
  if (kEl) kEl.innerHTML = `<span class="crit-bullet">${kOk ? '✅' : '⚪'}</span> 30 días sin dolor de rodilla (Días: <strong>${ex.consecutiveNoPainDays}/30</strong>)`;
  if (sEl) sEl.innerHTML = `<span class="crit-bullet">${sOk ? '✅' : '⚪'}</span> 25 sesiones completadas de Fase 1 (Completadas: <strong>${ex.completedSessions}/25</strong>)`;

  const lockBox = document.getElementById('highImpactLockBox');
  const unlockContent = document.getElementById('unlockedHighImpactContent');

  if (wOk && kOk && sOk) {
    if (lockBox) lockBox.style.display = 'none';
    if (unlockContent) unlockContent.style.display = 'block';
  } else {
    if (lockBox) lockBox.style.display = 'block';
    if (unlockContent) unlockContent.style.display = 'none';
  }
}

function logKneePainStatus() {
  const chk = document.getElementById('chkKneePainToday');
  const hadPain = chk.checked;

  if (hadPain) {
    aegisState.exercise.consecutiveNoPainDays = 0;
    alert('Dolor registrado. El contador de días de rodilla se reinicia a 0 para proteger el cartílago. Prioriza descansos y compresión fría.');
  } else {
    aegisState.exercise.consecutiveNoPainDays += 1;
    alert(`Día sin dolor registrado con éxito (${aegisState.exercise.consecutiveNoPainDays}/30 días completados).`);
  }
  aegisState.exercise.todayKneeLogged = true;
  saveMasterState();
  checkExerciseUnlocks();
}

function startExerciseTimer() {
  let seconds = 15 * 60;
  clearInterval(exerciseTimerInterval);
  exerciseTimerInterval = setInterval(() => {
    seconds--;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    const disp = document.getElementById('exerciseTimerDisplay');
    if (disp) disp.textContent = `${m}:${s}`;

    if (seconds <= 0) {
      clearInterval(exerciseTimerInterval);
      playChime(440, 880, 0.6);
      aegisState.exercise.completedSessions += 1;
      saveMasterState();
      alert('¡15 Minutos de estimulación de BDNF completados con éxito!');
      checkExerciseUnlocks();
    }
  }, 1000);
}

// =============================================================================
// 9. MÓDULO 6: TRABAJO, POMODORO (8x25) & DETECTOR DE RECAÍDA
// =============================================================================

function renderWorkModule() {
  const w = aegisState.work;
  const pBadge = document.getElementById('pomodoroCycleBadge');
  const pDisp = document.getElementById('pomodoroTimerDisplay');
  const pLabel = document.getElementById('pomodoroModeLabel');

  if (pBadge) pBadge.textContent = `Ciclo ${w.currentCycle} de 8`;

  const min = Math.floor(w.secondsRemaining / 60).toString().padStart(2, '0');
  const sec = (w.secondsRemaining % 60).toString().padStart(2, '0');
  if (pDisp) pDisp.textContent = `${min}:${sec}`;
  if (pLabel) pLabel.textContent = w.mode === 'work' ? 'TRABAJO ENFOCADO (25 MIN)' : 'DESCANSO (5 MIN)';

  // Renderizar 8 bolitas de progreso
  const dotsEl = document.getElementById('pomodoroDotsContainer');
  if (dotsEl) {
    let dotsHtml = '';
    for (let i = 1; i <= 8; i++) {
      let cls = 'pomo-dot';
      if (i < w.currentCycle) cls += ' done';
      else if (i === w.currentCycle) cls += ' active';
      dotsHtml += `<div class="${cls}" title="Ciclo ${i}"></div>`;
    }
    dotsEl.innerHTML = dotsHtml;
  }
}

function startPomodoro() {
  if (aegisState.work.isRunning) return;
  aegisState.work.isRunning = true;
  clearInterval(pomodoroInterval);

  pomodoroInterval = setInterval(() => {
    if (aegisState.work.secondsRemaining > 0) {
      aegisState.work.secondsRemaining--;
      renderWorkModule();
    } else {
      // Cambio de modo
      playChime(523.25, 659.25, 0.5);
      if (aegisState.work.mode === 'work') {
        aegisState.work.mode = 'rest';
        aegisState.work.secondsRemaining = 5 * 60;
        showRestAuditQuestionnaire();
      } else {
        aegisState.work.mode = 'work';
        aegisState.work.secondsRemaining = 25 * 60;
        if (aegisState.work.currentCycle < 8) {
          aegisState.work.currentCycle++;
        }
      }
      renderWorkModule();
      saveMasterState();
    }
  }, 1000);
}

function pausePomodoro() {
  aegisState.work.isRunning = false;
  clearInterval(pomodoroInterval);
  renderWorkModule();
}

function showRestAuditQuestionnaire() {
  const box = document.getElementById('pomodoroRestAuditBox');
  if (box) box.style.display = 'block';
}

/**
 * Árbol de Decisión Determinista de Prevención de Recaída:
 * Si Deseo de Alcohol >= 3 O Ansiedad >= 4 -> ALERTA ROJA (Bloqueo y Emergencia).
 */
function submitRestAudit() {
  const anx = parseInt(document.getElementById('auditAnxiety').value, 10);
  const foc = parseInt(document.getElementById('auditFocus').value, 10);
  const hun = parseInt(document.getElementById('auditHunger').value, 10);
  const alc = parseInt(document.getElementById('auditAlcohol').value, 10);

  const logEntry = {
    cycle: aegisState.work.currentCycle,
    anxiety: anx,
    focus: foc,
    hunger: hun,
    alcohol: alc,
    timestamp: new Date().toLocaleTimeString()
  };

  aegisState.work.restAudits.push(logEntry);
  document.getElementById('pomodoroRestAuditBox').style.display = 'none';
  saveMasterState();

  // Evaluador Determinista de Riesgo de Recaída
  if (alc >= 3 || anx >= 4) {
    triggerRelapseEmergency(alc, anx, hun);
  } else {
    alert('Auditoría aprobada: Marcadores estables. Puedes continuar con el ciclo.');
  }
}

function triggerRelapseEmergency(alc, anx, hun) {
  pausePomodoro();
  const modal = document.getElementById('relapseEmergencyModal');
  if (modal) modal.style.display = 'flex';
  playChime(220, 110, 0.8); // Alarma grave disuasoria
}

function deescalateRelapseEmergency() {
  const notes = document.getElementById('relapseReasonNotes').value;
  if (!notes || notes.trim().length < 5) {
    alert('Por favor redacta brevemente la causa disparadora identificada antes de desactivar la emergencia.');
    return;
  }
  document.getElementById('relapseEmergencyModal').style.display = 'none';
  alert('Protocolo de sobriedad certificado. Mantente alerta y continúa con hidratación y calma.');
}

// POS Don Pale Functions
function addItemToPos(name, price) {
  aegisState.work.posCart.push({ name, price });
  renderPosTicket();
}

function renderPosTicket() {
  const tEl = document.getElementById('posTicketList');
  const totEl = document.getElementById('posTotalVal');
  if (!tEl || !totEl) return;

  if (aegisState.work.posCart.length === 0) {
    tEl.innerHTML = 'Sin productos en la cuenta';
    totEl.textContent = '$0.00';
    return;
  }

  let sum = 0;
  tEl.innerHTML = aegisState.work.posCart.map(item => {
    sum += item.price;
    return `<div>• ${item.name} - $${item.price.toFixed(2)}</div>`;
  }).join('');
  totEl.textContent = `$${sum.toFixed(2)}`;
}

function processPosSale() {
  const sum = aegisState.work.posCart.reduce((a, b) => a + b.price, 0);
  if (sum <= 0) {
    alert('No hay artículos en la cuenta.');
    return;
  }

  const method = document.getElementById('posPaymentMethod').value;
  if (!aegisState.work.productSalesCount) aegisState.work.productSalesCount = {};
  aegisState.work.posCart.forEach(item => {
    aegisState.work.productSalesCount[item.name] = (aegisState.work.productSalesCount[item.name] || 0) + 1;
  });

  if (method === 'Moneda Virtual Pale') {
    if (aegisState.work.posTokenBalance === undefined) aegisState.work.posTokenBalance = 150.0;
    aegisState.work.posTokenBalance += sum;
  }

  distributeIncome(sum, `Venta POS Don Pale (${method})`, 'Comercial');
  aegisState.work.posCart = [];
  renderPosTicket();
  renderPosAnalytics();
  closeModal('posModal');
  alert(`Cobro procesado por $${sum.toFixed(2)} [${method}]. Registrado en analítica de productos y distribuido automáticamente en las 5 cubetas.`);
}

function renderPosAnalytics() {
  const listEl = document.getElementById('posTopProductsList');
  const tokEl = document.getElementById('posVirtualTokenBalance');
  if (tokEl && aegisState.work.posTokenBalance !== undefined) {
    tokEl.textContent = `${aegisState.work.posTokenBalance.toFixed(2)} MVP`;
  }
  if (listEl && aegisState.work.productSalesCount) {
    const sorted = Object.entries(aegisState.work.productSalesCount).sort((a, b) => b[1] - a[1]);
    listEl.innerHTML = sorted.map(([name, count]) => `• ${name} (<strong>${count}</strong> ventas registradas)`).join('<br>');
  }
}

// =============================================================================
// 10. MÓDULO 7: ESTUDIO (4 HORAS / 6 RAMAS ACADÉMICAS)
// =============================================================================

function renderStudyModule() {
  const matrixEl = document.getElementById('branchesMatrixContainer');
  if (matrixEl && aegisState.study.branches) {
    matrixEl.innerHTML = aegisState.study.branches.map(b => `
      <div class="branch-card">
        <div class="branch-header">
          <span>${b.name}</span>
          <span class="branch-hours">${b.hours.toFixed(1)} hrs</span>
        </div>
        <p class="text-xs text-muted mt-1">${b.desc}</p>
      </div>
    `).join('');
  }
}

function startStudyTimer() {
  if (aegisState.study.isRunning) return;
  aegisState.study.isRunning = true;
  clearInterval(studyTimerInterval);

  studyTimerInterval = setInterval(() => {
    aegisState.study.secondsElapsed++;
    const sec = aegisState.study.secondsElapsed;
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');

    const disp = document.getElementById('studyTimerDisplay');
    if (disp) disp.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

function pauseStudyTimer() {
  aegisState.study.isRunning = false;
  clearInterval(studyTimerInterval);
}

function saveStudySession() {
  pauseStudyTimer();
  const hoursEarned = aegisState.study.secondsElapsed / 3600;
  if (hoursEarned < 0.05) {
    alert('La sesión es menor a 3 minutos, no se registró tiempo.');
    aegisState.study.secondsElapsed = 0;
    document.getElementById('studyTimerDisplay').textContent = '00:00:00';
    return;
  }

  const branchName = document.getElementById('selectStudyBranch').value;
  const branch = aegisState.study.branches.find(b => b.name === branchName);
  if (branch) {
    branch.hours += hoursEarned;
  }

  aegisState.study.secondsElapsed = 0;
  document.getElementById('studyTimerDisplay').textContent = '00:00:00';
  document.getElementById('inputStudyNotes').value = '';

  saveMasterState();
  renderStudyModule();
  alert(`¡Sesión de estudio registrada! +${hoursEarned.toFixed(2)} horas añadidas a ${branchName}.`);
}

// =============================================================================
// 11. MANEJADORES DE EVENTOS DE LA INTERFAZ
// =============================================================================

function setupAllEventListeners() {
  // Pestañas Principales (7 Módulos)
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.module-tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Toggle Tema
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Módulo 1: Sueño & Cronobiología
  const btnStartSleep = document.getElementById('btnStartSleepStopwatch');
  if (btnStartSleep) btnStartSleep.addEventListener('click', handleStartSleep);

  const btnStopSleep = document.getElementById('btnStopSleepStopwatch');
  if (btnStopSleep) btnStopSleep.addEventListener('click', handleStopSleep);

  const btnSaveSleep = document.getElementById('btnSaveSleepLog');
  if (btnSaveSleep) btnSaveSleep.addEventListener('click', saveSleepLog);

  // Rollover diario (Manual / Header)
  const btnManRollover = document.getElementById('btnManualDayRollover');
  if (btnManRollover) btnManRollover.addEventListener('click', handleManualDayRollover);

  const btnHdrNewDay = document.getElementById('btnHeaderNewDay');
  if (btnHdrNewDay) btnHdrNewDay.addEventListener('click', handleManualDayRollover);

  // Módulo 1.B: Craving (Alcohol & Tabaco) & Abstinencia
  const btnRelapse = document.getElementById('btnRelapseReset');
  if (btnRelapse) btnRelapse.addEventListener('click', handleRelapseReset);

  const btnSaveStart = document.getElementById('btnSaveAbstinenceStartDate');
  if (btnSaveStart) btnSaveStart.addEventListener('click', handleUpdateAbstinenceStartDate);

  const inStart = document.getElementById('inputAbstinenceStartDate');
  if (inStart) inStart.addEventListener('change', handleUpdateAbstinenceStartDate);

  const btnLogCraving = document.getElementById('btnLogCravingEpisode');
  if (btnLogCraving) btnLogCraving.addEventListener('click', handleLogCravingEpisode);

  const sliderAlc = document.getElementById('sliderAlcoholCraving');
  if (sliderAlc) sliderAlc.addEventListener('input', updateCravingSliderDisplay);

  const sliderSmk = document.getElementById('sliderSmokeCraving');
  if (sliderSmk) sliderSmk.addEventListener('input', updateCravingSliderDisplay);

  // Módulo 2: Contabilidad (5 Cubetas & Libro Mayor)
  const btnDistIncome = document.getElementById('btnDistributeIncome');
  if (btnDistIncome) {
    btnDistIncome.addEventListener('click', () => {
      const amt = parseFloat(document.getElementById('inputNewIncome').value);
      const src = document.getElementById('inputIncomeSource').value;
      const cat = document.getElementById('inputIncomeCategory') ? document.getElementById('inputIncomeCategory').value : 'Ingeniería';
      distributeIncome(amt, src, cat);
      document.getElementById('inputNewIncome').value = '';
      document.getElementById('inputIncomeSource').value = '';
    });
  }

  const btnResetZero = document.getElementById('btnResetBucketsZero');
  if (btnResetZero) btnResetZero.addEventListener('click', resetBucketsToZero);

  // Gastos específicos con registro inmediato en Libro Mayor (7 días)
  const btnAddGD = document.getElementById('btnAddExpenseDaily');
  if (btnAddGD) {
    btnAddGD.addEventListener('click', () => {
      const name = document.getElementById('gdName').value.trim();
      const amount = parseFloat(document.getElementById('gdAmount').value);
      const place = document.getElementById('gdPlace').value.trim();
      const cat = document.getElementById('gdCat').value;

      if (!name || isNaN(amount) || amount <= 0) { alert('Ingresa nombre y monto válido'); return; }
      if (aegisState.accounting.buckets.b1_daily < amount) {
        alert('Fondos insuficientes en la Cubeta 1 (Operativos Diarios). Regla estricta: Prohibido tomar dinero de otras cubetas.');
        return;
      }
      aegisState.accounting.buckets.b1_daily -= amount;
      aegisState.accounting.expensesDaily.unshift({ name, amount, place, cat, date: new Date().toLocaleDateString() });
      aegisState.accounting.ledger.unshift({
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'Egreso',
        category: cat,
        description: `${name}${place ? ' (' + place + ')' : ''}`,
        bucket: 'Cubeta 1 (Diario)',
        amount: amount
      });
      saveMasterState();
      renderAccountingModule();
      document.getElementById('gdName').value = '';
      document.getElementById('gdAmount').value = '';
      document.getElementById('gdPlace').value = '';
      alert('Gasto diario registrado.');
    });
  }

  const btnAddGW = document.getElementById('btnAddExpenseWeekly');
  if (btnAddGW) {
    btnAddGW.addEventListener('click', () => {
      const name = document.getElementById('gwName').value.trim();
      const amount = parseFloat(document.getElementById('gwAmount').value);
      const place = document.getElementById('gwPlace').value.trim();
      const cat = document.getElementById('gwCat').value;

      if (!name || isNaN(amount) || amount <= 0) { alert('Ingresa nombre y monto válido'); return; }
      if (aegisState.accounting.buckets.b2_weekly < amount) { alert('Fondos insuficientes en la Cubeta 2.'); return; }
      aegisState.accounting.buckets.b2_weekly -= amount;
      aegisState.accounting.expensesWeekly.unshift({ name, amount, place, cat, date: new Date().toLocaleDateString() });
      aegisState.accounting.ledger.unshift({
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'Egreso',
        category: cat,
        description: `${name}${place ? ' (' + place + ')' : ''}`,
        bucket: 'Cubeta 2 (Semanal)',
        amount: amount
      });
      saveMasterState();
      renderAccountingModule();
      document.getElementById('gwName').value = '';
      document.getElementById('gwAmount').value = '';
      document.getElementById('gwPlace').value = '';
      alert('Gasto semanal registrado.');
    });
  }

  const btnAddGM = document.getElementById('btnAddExpenseMonthly');
  if (btnAddGM) {
    btnAddGM.addEventListener('click', () => {
      const name = document.getElementById('gmName').value.trim();
      const amount = parseFloat(document.getElementById('gmAmount').value);
      const place = document.getElementById('gmPlace').value.trim();
      const cat = document.getElementById('gmCat').value;

      if (!name || isNaN(amount) || amount <= 0) { alert('Ingresa nombre y monto válido'); return; }
      if (aegisState.accounting.buckets.b3_monthly < amount) { alert('Fondos insuficientes en la Cubeta 3.'); return; }
      aegisState.accounting.buckets.b3_monthly -= amount;
      aegisState.accounting.expensesMonthly.unshift({ name, amount, place, cat, date: new Date().toLocaleDateString() });
      aegisState.accounting.ledger.unshift({
        id: 'tx_' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'Egreso',
        category: cat,
        description: `${name}${place ? ' (' + place + ')' : ''}`,
        bucket: 'Cubeta 3 (Mensual)',
        amount: amount
      });
      saveMasterState();
      renderAccountingModule();
      document.getElementById('gmName').value = '';
      document.getElementById('gmAmount').value = '';
      document.getElementById('gmPlace').value = '';
      alert('Gasto mensual registrado.');
    });
  }

  // Modales de Proyectos de Inversión
  const btnOpenNP = document.getElementById('btnOpenNewProjectModal');
  if (btnOpenNP) {
    btnOpenNP.addEventListener('click', () => {
      document.getElementById('npName').value = '';
      document.getElementById('npRoiTime').value = '3 semanas';
      document.getElementById('npStatusSelect').value = 'en espera';
      const container = document.getElementById('npComponentsRowsContainer');
      if (container) {
        container.innerHTML = '';
        addProjectComponentRow('npComponentsRowsContainer');
      }
      openModal('newProjectModal');
    });
  }
  const btnCloseNP = document.getElementById('btnCloseNewProjectModal');
  if (btnCloseNP) btnCloseNP.addEventListener('click', () => closeModal('newProjectModal'));
  const btnCancelNP = document.getElementById('btnCancelNewProject');
  if (btnCancelNP) btnCancelNP.addEventListener('click', () => closeModal('newProjectModal'));

  const btnAddNPComp = document.getElementById('btnAddProjectCompRow');
  if (btnAddNPComp) {
    btnAddNPComp.addEventListener('click', () => addProjectComponentRow('npComponentsRowsContainer'));
  }

  const btnSaveNP = document.getElementById('btnSaveNewProject');
  if (btnSaveNP) {
    btnSaveNP.addEventListener('click', () => {
      const name = document.getElementById('npName').value.trim();
      const returnTime = document.getElementById('npRoiTime').value.trim() || '3 semanas';
      const status = document.getElementById('npStatusSelect').value || 'en espera';

      if (!name) { alert('Ingresa el nombre del proyecto'); return; }

      const components = [];
      let totalCost = 0;
      document.querySelectorAll('#npComponentsRowsContainer .comp-item-row').forEach(row => {
        const cName = row.querySelector('.comp-name-input').value.trim();
        const cPrice = parseFloat(row.querySelector('.comp-price-input').value) || 0;
        if (cName || cPrice > 0) {
          components.push({
            id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 5),
            name: cName || 'Insumo',
            price: cPrice
          });
          totalCost += cPrice;
        }
      });

      aegisState.accounting.investmentProjects.push({
        id: 'inv_' + Date.now(),
        name,
        status,
        returnTime,
        components,
        totalCost,
        cost: totalCost
      });
      saveMasterState();
      renderAccountingModule();
      closeModal('newProjectModal');
      alert(`Proyecto de inversión "${name}" creado exitosamente.`);
    });
  }

  // Modal Editar Proyecto
  const btnEditAddComp = document.getElementById('btnEditAddCompRow');
  if (btnEditAddComp) {
    btnEditAddComp.addEventListener('click', () => addProjectComponentRow('epComponentsRowsContainer'));
  }
  const btnCloseEP = document.getElementById('btnCloseEditProjectModal');
  if (btnCloseEP) btnCloseEP.addEventListener('click', () => closeModal('editProjectModal'));
  const btnCancelEP = document.getElementById('btnCancelEditProject');
  if (btnCancelEP) btnCancelEP.addEventListener('click', () => closeModal('editProjectModal'));
  const btnSaveEP = document.getElementById('btnSaveEditProject');
  if (btnSaveEP) btnSaveEP.addEventListener('click', saveEditProject);
  const btnDeleteP = document.getElementById('btnDeleteProject');
  if (btnDeleteP) {
    btnDeleteP.addEventListener('click', () => {
      const pid = document.getElementById('epProjectId').value;
      deleteProject(pid);
    });
  }

  // Modal Premios (Interruptor Lógico con 4 Métricas Deterministas)
  const btnOpenNR = document.getElementById('btnOpenNewRewardModal');
  if (btnOpenNR) {
    btnOpenNR.addEventListener('click', () => {
      document.getElementById('nrName').value = '';
      openModal('newRewardModal');
    });
  }
  const btnCloseNR = document.getElementById('btnCloseNewRewardModal');
  if (btnCloseNR) btnCloseNR.addEventListener('click', () => closeModal('newRewardModal'));
  const btnCancelNR = document.getElementById('btnCancelNewReward');
  if (btnCancelNR) btnCancelNR.addEventListener('click', () => closeModal('newRewardModal'));
  const btnSaveNR = document.getElementById('btnSaveNewReward');
  if (btnSaveNR) {
    btnSaveNR.addEventListener('click', () => {
      const name = document.getElementById('nrName').value.trim();
      const soberDays = parseInt(document.getElementById('nrSoberDays').value, 10) || 30;
      const weightTarget = parseFloat(document.getElementById('nrWeightTarget').value) || 74.0;
      const money = parseFloat(document.getElementById('nrMoney').value) || 1000;
      const deadline = document.getElementById('nrDeadline').value || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

      if (!name) { alert('Ingresa el nombre del premio'); return; }
      aegisState.accounting.rewards.push({
        id: 'rew_' + Date.now(),
        name,
        soberDays,
        weightTarget,
        money,
        deadline,
        status: 'pending'
      });
      saveMasterState();
      renderAccountingModule();
      closeModal('newRewardModal');
      alert(`Premio "${name}" configurado con interruptor lógico auditado.`);
    });
  }

  // Módulo 3: Nutrición & Báscula Renpho
  const btnConnectBle = document.getElementById('connectBleBtn');
  if (btnConnectBle) {
    btnConnectBle.addEventListener('click', async () => {
      if (!scaleDriver) initScaleDriverSafe();
      if (!scaleDriver || !scaleDriver.isSupported()) {
        openModal('bleHelpModal');
        return;
      }
      const chk = document.getElementById('chkAcceptAll');
      const acceptAll = chk ? chk.checked : true;
      try {
        await scaleDriver.connect({ acceptAll });
      } catch (e) {
        console.warn('Conexión BLE cancelada o fallida:', e);
      }
    });
  }

  const btnDisconnectBle = document.getElementById('disconnectBleBtn');
  if (btnDisconnectBle) {
    btnDisconnectBle.addEventListener('click', () => {
      if (scaleDriver) scaleDriver.disconnect();
    });
  }

  const btnSimScale = document.getElementById('simulateScaleBtn');
  if (btnSimScale) btnSimScale.addEventListener('click', simulateScaleReading);

  const btnSetManualWeight = document.getElementById('setManualWeightBtn');
  if (btnSetManualWeight) {
    btnSetManualWeight.addEventListener('click', () => {
      const w = parseFloat(document.getElementById('manualWeightInput').value);
      if (!isNaN(w) && w >= 30 && w <= 250) {
        registerNewWeight(w);
      } else {
        alert('Ingresa un peso válido entre 30 y 250 kg.');
      }
    });
  }

  const btnRecalcMifflin = document.getElementById('btnRecalculateMifflin');
  if (btnRecalcMifflin) {
    btnRecalcMifflin.addEventListener('click', () => {
      aegisState.userProfile.name = document.getElementById('profileName').value;
      aegisState.userProfile.birthdate = document.getElementById('profileBirthdate').value;
      aegisState.userProfile.height = parseFloat(document.getElementById('profileHeight').value) || 175;
      aegisState.userProfile.gender = document.getElementById('profileGender').value;
      aegisState.userProfile.activityFactor = parseFloat(document.getElementById('profileActivityFactor').value) || 1.2;
      saveMasterState();
      renderNutritionModule();
      alert('Perfil biométrico y fórmula de Mifflin-St. Jeor recalculados.');
    });
  }

  // Comparador de Nutrientes de Otzolotepec
  const btnRunComp = document.getElementById('btnRunNutriCompare');
  if (btnRunComp) btnRunComp.addEventListener('click', runNutriCompare);

  // Lista Semanal Dominical Otzolotepec
  const btnGenSunday = document.getElementById('btnGenerateSundayList');
  if (btnGenSunday) btnGenSunday.addEventListener('click', generateSundayShoppingList);

  const btnApplySunday = document.getElementById('btnApplySundayShopping');
  if (btnApplySunday) btnApplySunday.addEventListener('click', applySundayShopping);

  // Monitor de Hambre Determinista
  const rangeHunger = document.getElementById('hungerIntensityRange');
  if (rangeHunger) {
    rangeHunger.addEventListener('input', (e) => {
      const valEl = document.getElementById('hungerIntensityVal');
      const val = e.target.value;
      const labels = { 1: '1 - Muy leve', 2: '2 - Leve', 3: '3 - Moderada', 4: '4 - Intensa', 5: '5 - Voraz' };
      if (valEl) valEl.textContent = labels[val] || val;
    });
  }
  const btnRegHunger = document.getElementById('btnRegisterHunger');
  if (btnRegHunger) btnRegHunger.addEventListener('click', registerHungerEpisode);

  // Modal Compra Exacta Despensa
  const btnOpenPantryM = document.getElementById('btnOpenAddPantryItemModal');
  if (btnOpenPantryM) {
    btnOpenPantryM.addEventListener('click', () => openModal('addPantryModal'));
    const btnClosePantry = document.getElementById('btnCloseAddPantryModal');
    if (btnClosePantry) btnClosePantry.addEventListener('click', () => closeModal('addPantryModal'));
    const btnCancelPantry = document.getElementById('btnCancelAddPantry');
    if (btnCancelPantry) btnCancelPantry.addEventListener('click', () => closeModal('addPantryModal'));
    const btnSavePantry = document.getElementById('btnSaveAddPantry');
    if (btnSavePantry) {
      btnSavePantry.addEventListener('click', () => {
        const name = document.getElementById('npiName').value.trim();
        const qty = parseFloat(document.getElementById('npiQty').value) || 1.0;
        const unit = document.getElementById('npiUnit').value;
        const price = parseFloat(document.getElementById('npiPrice').value) || 0;
        const cat = document.getElementById('npiCat').value;

        if (!name) { alert('Ingresa el nombre del alimento'); return; }
        const dailyPortion = `${(qty * 1000 / 7).toFixed(0)}g/día`;
        aegisState.nutrition.pantryInventory.unshift({
          id: 'pi_' + Date.now(),
          name, qty, unit, price, cat, dailyPortion
        });

        // Se descuenta de Cubeta 2 si hay saldo suficiente y se registra en Ledger
        if (aegisState.accounting.buckets.b2_weekly >= price) {
          aegisState.accounting.buckets.b2_weekly -= price;
        }
        aegisState.accounting.ledger.unshift({
          id: 'tx_' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'Egreso',
          category: 'Comida',
          description: `Compra despensa: ${name} (${qty} ${unit})`,
          bucket: 'Cubeta 2 (Semanal)',
          amount: price
        });

        saveMasterState();
        renderNutritionModule();
        renderAccountingModule();
        closeModal('addPantryModal');
        document.getElementById('npiName').value = '';
        document.getElementById('npiPrice').value = '';
      });
    }
  }

  // Módulo 4: Medicación (Modales y CRUD)
  const btnOpenNewMed = document.getElementById('btnOpenNewMedModal');
  if (btnOpenNewMed) btnOpenNewMed.addEventListener('click', () => openModal('newMedModal'));

  const btnCloseNewMed = document.getElementById('btnCloseNewMedModal');
  if (btnCloseNewMed) btnCloseNewMed.addEventListener('click', () => closeModal('newMedModal'));

  const btnCancelNewMed = document.getElementById('btnCancelNewMed');
  if (btnCancelNewMed) btnCancelNewMed.addEventListener('click', () => closeModal('newMedModal'));

  const btnSaveNewMedEl = document.getElementById('btnSaveNewMed');
  if (btnSaveNewMedEl) btnSaveNewMedEl.addEventListener('click', saveNewMed);

  const btnCloseEditMed = document.getElementById('btnCloseEditMedModal');
  if (btnCloseEditMed) btnCloseEditMed.addEventListener('click', () => closeModal('editMedModal'));

  const btnCancelEditMed = document.getElementById('btnCancelEditMed');
  if (btnCancelEditMed) btnCancelEditMed.addEventListener('click', () => closeModal('editMedModal'));

  const btnSaveEditMedEl = document.getElementById('btnSaveEditMed');
  if (btnSaveEditMedEl) btnSaveEditMedEl.addEventListener('click', saveEditMed);

  const btnDeleteMedEl = document.getElementById('btnDeleteMed');
  if (btnDeleteMedEl) {
    btnDeleteMedEl.addEventListener('click', () => {
      const mid = document.getElementById('emMedId').value;
      deleteMedication(mid);
      closeModal('editMedModal');
    });
  }

  // Módulo 5: Ejercicio & Rodilla
  const btnStartEx = document.getElementById('btnStartExerciseTimer');
  if (btnStartEx) btnStartEx.addEventListener('click', startExerciseTimer);
  const btnPauseEx = document.getElementById('btnPauseExerciseTimer');
  if (btnPauseEx) btnPauseEx.addEventListener('click', () => clearInterval(exerciseTimerInterval));
  const btnCompleteEx = document.getElementById('btnCompleteExercise');
  if (btnCompleteEx) {
    btnCompleteEx.addEventListener('click', () => {
      aegisState.exercise.completedSessions += 1;
      saveMasterState();
      checkExerciseUnlocks();
      alert('¡Sesión de rehabilitación y producción de BDNF registrada!');
    });
  }
  const btnLogKnee = document.getElementById('btnLogKneeDay');
  if (btnLogKnee) btnLogKnee.addEventListener('click', logKneePainStatus);

  // Módulo 6: Trabajo & Pomodoro (8 Ciclos con Auditoría Obligatoria)
  const btnStartPomo = document.getElementById('btnStartPomodoro');
  if (btnStartPomo) btnStartPomo.addEventListener('click', startPomodoro);
  const btnPausePomo = document.getElementById('btnPausePomodoro');
  if (btnPausePomo) btnPausePomo.addEventListener('click', pausePomodoro);
  const btnResetPomo = document.getElementById('btnResetPomodoro');
  if (btnResetPomo) {
    btnResetPomo.addEventListener('click', () => {
      pausePomodoro();
      aegisState.work.secondsRemaining = 25 * 60;
      aegisState.work.mode = 'work';
      renderWorkModule();
    });
  }
  const btnSkipPomo = document.getElementById('btnSkipPomodoro');
  if (btnSkipPomo) {
    btnSkipPomo.addEventListener('click', () => {
      pausePomodoro();
      if (aegisState.work.mode === 'work') {
        aegisState.work.mode = 'rest';
        aegisState.work.secondsRemaining = 5 * 60;
        showRestAuditQuestionnaire();
      } else {
        aegisState.work.mode = 'work';
        aegisState.work.secondsRemaining = 25 * 60;
        if (aegisState.work.currentCycle < 8) aegisState.work.currentCycle++;
      }
      renderWorkModule();
    });
  }

  const btnSubmitAudit = document.getElementById('btnSubmitRestAudit');
  if (btnSubmitAudit) btnSubmitAudit.addEventListener('click', submitRestAudit);

  // Emergencia de Relapse (Protocolo Cerrado Anti-Recaída)
  const btnDeescalate = document.getElementById('btnDeescalateRelapse');
  if (btnDeescalate) btnDeescalate.addEventListener('click', deescalateRelapseEmergency);

  // Guía de respiración 4-7-8
  const btnStartBreath = document.getElementById('btnStartBreathing');
  if (btnStartBreath) {
    btnStartBreath.addEventListener('click', () => {
      const g = document.getElementById('breathingGuideText');
      if (g) {
        g.style.display = 'block';
        let step = 0;
        const phases = ['Inhala por la nariz (4s)...', 'Sostén el aire (7s)...', 'Exhala lentamente por la boca (8s)...'];
        setInterval(() => {
          g.textContent = phases[step % 3];
          step++;
        }, 4000);
      }
    });
  }

  // POS Don Pale Modal
  const btnOpenPos = document.getElementById('btnOpenPosModal');
  const posModal = document.getElementById('posModal');
  if (btnOpenPos && posModal) {
    btnOpenPos.addEventListener('click', () => {
      openModal('posModal');
      renderPosTicket();
      renderPosAnalytics();
    });
    const btnClosePos = document.getElementById('btnClosePosModal');
    if (btnClosePos) btnClosePos.addEventListener('click', () => closeModal('posModal'));
    document.querySelectorAll('.btn-pos-item').forEach(b => {
      b.addEventListener('click', () => {
        addItemToPos(b.dataset.name, parseFloat(b.dataset.price));
      });
    });
    const btnProcessSale = document.getElementById('btnProcessPosSale');
    if (btnProcessSale) btnProcessSale.addEventListener('click', processPosSale);
  }

  // Módulo 7: Estudio
  const btnStartStudy = document.getElementById('btnStartStudyTimer');
  if (btnStartStudy) btnStartStudy.addEventListener('click', startStudyTimer);
  const btnPauseStudy = document.getElementById('btnPauseStudyTimer');
  if (btnPauseStudy) btnPauseStudy.addEventListener('click', pauseStudyTimer);
  const btnSaveStudy = document.getElementById('btnSaveStudySession');
  if (btnSaveStudy) btnSaveStudy.addEventListener('click', saveStudySession);

  // Modal Bluetooth Help
  const closeBleBtn = document.getElementById('closeBleHelpBtn');
  const ackBleBtn = document.getElementById('ackBleHelpBtn');
  if (closeBleBtn) closeBleBtn.addEventListener('click', () => closeModal('bleHelpModal'));
  if (ackBleBtn) ackBleBtn.addEventListener('click', () => closeModal('bleHelpModal'));

  // Cerrar al hacer clic en el backdrop de cualquiera de los modales
  [
    'bleHelpModal', 'newProjectModal', 'editProjectModal', 'newRewardModal',
    'newMedModal', 'editMedModal', 'addPantryModal', 'posModal', 'relapseEmergencyModal'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) closeModal(id);
      });
    }
  });
}
