// State Management
let currentMainRole = "user"; 
let currentSubRole = "agriculture"; 
let loggedInIdentifier = "";
let currentScenario = "normal";
let lastVoiceAlertTime = 0;
let currentLang = "en"; // "en" or "ta"
let telemetryChart = null;

// Twilio Credentials
const TWILIO_ACCOUNT_SID = "ACf75251fc75ade8baf1d684e14da9be87";
const TWILIO_AUTH_TOKEN = "08f3b7da3dcb61f00d8eb0e79afe6348"; // Copy fresh token from Twilio Console if rotated
const TWILIO_PHONE_NUMBER = "+17372508034";

// Telemetry State
let currentData = {
  stressScore: 28,
  daysRemaining: 8.5,
  tankLevel: 78,
  borewellLevel: 65,
  temp: 29.2,
  humidity: 62,
  soilMoisture: 45,
  pipelinePressure: 2.4,
  tds: 320,
  salinity: 0.5,
  rain: 0,
  leakStatus: "NO LEAK",
  usage: 180,
};

// Registered Crops Database
let cropsData = [
  {
    id: "sugarcane",
    nameEn: "Sugarcane (Zone A)",
    nameTa: "கரும்பு (மண்டலம் A)",
    icon: "🌾",
    targetRequiredLiters: 1200,
    deliveredLiters: 850,
  },
  {
    id: "paddy",
    nameEn: "Paddy Rice (Zone B)",
    nameTa: "நெல் பயிர் (மண்டலம் B)",
    icon: "🌱",
    targetRequiredLiters: 950,
    deliveredLiters: 950,
  },
  {
    id: "wheat",
    nameEn: "Wheat Crop (Zone C)",
    nameTa: "கோடை கோதுமை (மண்டலம் C)",
    icon: "🌽",
    targetRequiredLiters: 600,
    deliveredLiters: 220,
  }
];

// Bilingual Dictionary
const i18n = {
  en: {
    systemNormal: "SYSTEM NORMAL",
    criticalStress: "CRITICAL WATER STRESS",
    signOut: "🔒 Sign Out",
    authType: "I am signing in as:",
    citizen: "CITIZEN / USER",
    officer: "PUBLIC OFFICER",
    sectorProfile: "Select User Sector Profile",
    mobilePhone: "Mobile Phone Number (Target Phone Call)",
    jurisdiction: "Select Administrative Jurisdiction",
    badgeId: "Officer Mobile ID (For Voice Calls)",
    back: "← Back",
    accessDash: "ACCESS DASHBOARD",
    enterCommand: "ENTER COMMAND CENTER",
    waterStressScore: "Water Stress Score",
    farmReserves: "Estimated Farm Reserves",
    farmReservesSub: "based on crop soil evapotranspiration",
    houseAutonomy: "Household Water Autonomy",
    houseAutonomySub: "based on daily family usage patterns",
    storageSump: "Storage Sump Reservoir",
    ohtLevel: "Overhead Tank (OHT) Level",
    borewellLevel: "Borewell Level",
    supplyPressure: "Supply Line Pressure",
    safeAquifer: "↑ Safe Operating Aquifer",
    depletionWarn: "↓ Aquifer Depletion Warning",
    lowPressWarn: "⚠️ Low Pressure Warning",
    optPress: "✓ Optimal Pipe Pressure",
    liveAgriTel: "Live Agricultural Telemetry",
    liveHouseTel: "Live Household Plumbing & Tank Telemetry",
    modeAgri: "MODE: AGRICULTURE",
    modeHouse: "MODE: HOUSEHOLD / DOMESTIC",
    temp: "🌡️ Temp",
    humidity: "💧 Air Humidity",
    soilMoisture: "🌱 Soil Moisture",
    pipePressure: "💧 Pipe Pressure",
    waterTds: "🧂 Water TDS",
    salinity: "🌊 Salinity Level",
    rainfall: "🌧️ Rainfall",
    leakStatus: "🔎 Leak Status",
    waterFlow: "🚰 Water Flow",
    dailyUsage: "🚰 Daily House Usage",
    safeFresh: "SAFE / FRESH",
    highSalinity: "⚠️ HIGH SALINITY",
    cropMonitorSub: "Precision Crop Hydration Monitor",
    cropMonitorTitle: "🌾 Plant Water Requirements & Deficit Analytics",
    weatherSub: "Meteorological Radar",
    weatherTitle: "🌧️ Live Regional Weather & Precipitation Map",
    aiAgriEngine: "AI Crop & Aquifer Engine",
    aiHouseEngine: "AI Domestic Resource Allocator",
    optAllocation: "🟢 OPTIMAL WATER ALLOCATION",
    optHouse: "🟢 DOMESTIC SUPPLY NOMINAL",
    critDrought: "🔴 CRITICAL DROUGHT: CROP RATIONING",
    critHouse: "🔴 HOUSEHOLD CONSERVATION MODE",
    liveOpt: "Live Optimization",
    triggerBreakdown: "Trigger Breakdown",
    actionsRecs: "Automated Actions & Recommendations",
    stressCtrl: "Environment Stress Controller",
    stressSim: "Stress Mode Simulator",
    stressDesc: "Toggle stress conditions to test automated phone calls to logged-in user, salinity warnings, and regional sync.",
    normalCond: "NORMAL CONDITIONS",
    droughtCond: "EL NIÑO DROUGHT MODE",
    callInfo: "🔊 Critical stress triggers an actual outbound phone call to your logged-in mobile number in Tamil & English.",
    graphTitleAgri: "Real-Time Aquifer & Soil Moisture Trends",
    graphTitleHouse: "Overhead Tank Level & Supply Pressure Trends",
    irrigationNeeded: "IRRIGATION NEEDED",
    fullyHydrated: "FULLY HYDRATED",
    waterReqPlant: "Water Required by Plant:",
    waterDelivered: "Current Water Delivered:",
    waterNeeded: "Water Needed (Deficit):",
    totalVolUsed: "Total Volume Going to be Used:",
    hydrationProg: "Hydration Progress",
    litersDay: "Liters/day",
    liters: "Liters",
    villageSub: "Rural Groundwater Authority Command Center",
    villageTitle: "🌾 Village Regional Water Resource Grid",
    clusterStress: "Cluster Stress Score",
    avgBorewell: "Avg Aquifer Drawdown",
    avgTds: "Avg Irrigation TDS",
    avgSal: "Avg Soil Salinity",
    activePumps: "Active Sub-Pumps",
    agriTableTitle: "Live Registered Agricultural Field Nodes",
    citySub: "Municipal Water Supply Grid Command Center",
    cityTitle: "🏙️ Metropolitan Water Grid Overview",
    urbanStress: "Urban Stress Index",
    avgOht: "Avg OHT Reservoir",
    avgPress: "Avg Pipe Pressure",
    citySal: "Tap Water Salinity",
    cityBooster: "Main Booster Pumps",
    cityTableTitle: "Live Registered Municipal Household Connections",
    thPhone: "User Phone / ID",
    thZone: "Crop Zone",
    thMoist: "Soil Moisture",
    thBorewell: "Borewell Level",
    thSalinity: "Salinity (dS/m)",
    thFlow: "Flow Rate",
    thStatus: "Status",
    thWard: "Ward Sector",
    thTank: "Tank Level",
    thPress: "Supply Pressure",
    thUsage: "Daily Usage"
  },
  ta: {
    systemNormal: "அமைப்பு இயல்பானது",
    criticalStress: "கடுமையான நீர் தட்டுப்பாடு",
    signOut: "🔒 வெளியேறு",
    authType: "உள்நுழைவு வகையைத் தேர்ந்தெடுக்கவும்:",
    citizen: "குடிமகன் / பயனர்",
    officer: "அரசு அதிகாரி",
    sectorProfile: "பயனர் துறை சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
    mobilePhone: "கைபேசி எண் (தொலைபேசி அழைப்புக்கான எண்)",
    jurisdiction: "நிர்வாக வரம்பைத் தேர்ந்தெடுக்கவும்",
    badgeId: "அதிகாரி அடையாள எண் (அழைப்புகளுக்கு)",
    back: "← பின்செல்",
    accessDash: "டாஷ்போர்டை அணுகவும்",
    enterCommand: "கட்டளை மையத்தில் நுழைக",
    waterStressScore: "நீர் அழுத்தக் குறியீடு",
    farmReserves: "மதிப்பிடப்பட்ட பண்ணை நீர் இருப்பு",
    farmReservesSub: "பயிர்களின் மண் நீராவியாதல் அடிப்படையில்",
    houseAutonomy: "வீட்டு நீர் தன்னாட்சி இருப்பு",
    houseAutonomySub: "தினசரி குடும்ப பயன்பாட்டின் அடிப்படையில்",
    storageSump: "சேமிப்புத் தொட்டி இருப்பு",
    ohtLevel: "மேல்நிலைத் தொட்டி (OHT) நிலை",
    borewellLevel: "ஆழ்துளை கிணறு நீர்மட்டம்",
    supplyPressure: "விநியோக குழாய் அழுத்தம்",
    safeAquifer: "↑ பாதுகாப்பான நிலத்தடி நீர் நிலை",
    depletionWarn: "↓ நிலத்தடி நீர் குறைவு எச்சரிக்கை",
    lowPressWarn: "⚠️ குறைந்த அழுத்த எச்சரிக்கை",
    optPress: "✓ சிறப்பான குழாய் அழுத்தம்",
    liveAgriTel: "நேரடி விவசாய தொலைநிலைக் கண்காணிப்பு",
    liveHouseTel: "நேரடி வீட்டு நீர் மற்றும் தொட்டி தொலைநிலை கண்காணிப்பு",
    modeAgri: "முறை: விவசாயம்",
    modeHouse: "முறை: வீட்டு உபயோகம்",
    temp: "🌡️ வெப்பநிலை",
    humidity: "💧 காற்று ஈரப்பதம்",
    soilMoisture: "🌱 மண் ஈரப்பதம்",
    pipePressure: "💧 குழாய் அழுத்தம்",
    waterTds: "🧂 நீர் TDS அளவு",
    salinity: "🌊 உவர்ப்புத் தன்மை (உப்பு)",
    rainfall: "🌧️ மழைப்பொழிவு",
    leakStatus: "🔎 கசிவு நிலை",
    waterFlow: "🚰 நீர் பாய்ச்சல் வேகம்",
    dailyUsage: "🚰 தினசரி வீட்டுப் பயன்பாடு",
    safeFresh: "பாதுகாப்பானது / நன்னீர்",
    highSalinity: "⚠️ அதிக உவர்ப்புத் தன்மை",
    cropMonitorSub: "துல்லிய பயிர் நீரேற்றக் கண்காணிப்பு",
    cropMonitorTitle: "🌾 பயிர் நீர் தேவைகள் மற்றும் பற்றாக்குறை பகுப்பாய்வு",
    weatherSub: "வானிலை ரேடார்",
    weatherTitle: "🌧️ மண்டல வானிலை மற்றும் மழைப்பொழிவு வரைபடம்",
    aiAgriEngine: "AI பயிர் மற்றும் நிலத்தடி நீர் எஞ்சின்",
    aiHouseEngine: "AI வீட்டு வள ஒதுக்கீட்டான்",
    optAllocation: "🟢 உகந்த நீர் ஒதுக்கீடு",
    optHouse: "🟢 வீட்டு நீர் விநியோகம் இயல்பானது",
    critDrought: "🔴 கடுமையான வறட்சி: பயிர் நீர் பங்கீடு",
    critHouse: "🔴 வீட்டு நீர் சேமிப்பு முறை",
    liveOpt: "நேரடி தேர்வுமுறை",
    triggerBreakdown: "காரணங்களின் விவரம்",
    actionsRecs: "தானியங்கி நடவடிக்கைகள் & பரிந்துரைகள்",
    stressCtrl: "சுற்றுச்சூழல் அழுத்தக் கட்டுப்படுத்தி",
    stressSim: "அழுத்த முறை மாதிரி",
    stressDesc: "உங்கள் கைபேசி எண்ணிற்கு தானியங்கி அழைப்புகள் மற்றும் உவர்ப்பு எச்சரிக்கைகளை சோதிக்க அழுத்த முறையை மாற்றவும்.",
    normalCond: "இயல்பு நிலை",
    droughtCond: "எல் நினோ வறட்சி முறை",
    callInfo: "🔊 கடுமையான நீர் தட்டுப்பாடு ஏற்படும் போது உங்கள் கைபேசிக்கு தமிழ் மற்றும் ஆங்கிலத்தில் தானியங்கி அழைப்பு வரும்.",
    graphTitleAgri: "நிலத்தடி நீர் மற்றும் மண் ஈரப்பதம் போக்குகள்",
    graphTitleHouse: "மேல்நிலைத் தொட்டி மற்றும் விநியோக அழுத்தப் போக்குகள்",
    irrigationNeeded: "பாசனம் தேவைப்படுகிறது",
    fullyHydrated: "முழுமையாக நீரேற்றம் அடைந்தது",
    waterReqPlant: "பயிரின் மொத்த நீர் தேவை:",
    waterDelivered: "தற்போது வழங்கப்பட்ட நீர்:",
    waterNeeded: "தேவைப்படும் மேலதிக நீர் (பற்றாக்குறை):",
    totalVolUsed: "பயன்படுத்தப்படவுள்ள மொத்த நீர்:",
    hydrationProg: "நீரேற்ற முன்னேற்றம்",
    litersDay: "லிட்டர்/நாள்",
    liters: "லிட்டர்",
    villageSub: "கிராமப்புற நிலத்தடி நீர் அதிகார மைய கட்டளை அறை",
    villageTitle: "🌾 கிராமப்புற நீர் வள கட்டமைப்பு",
    clusterStress: "வட்டார நீர் அழுத்தக் குறியீடு",
    avgBorewell: "சராசரி கிணற்று நீர்மட்டம்",
    avgTds: "சராசரி பாசன TDS",
    avgSal: "சராசரி மண் உவர்ப்பு",
    activePumps: "இயங்கும் மோட்டார்கள்",
    agriTableTitle: "பதிவுசெய்யப்பட்ட விவசாய நில முனையங்கள்",
    citySub: "மாநகராட்சி நீர் விநியோக கட்டளை மையம்",
    cityTitle: "🏙️ மாநகர நீர் விநியோகக் கட்டமைப்பு",
    urbanStress: "நகர்ப்புற நீர் அழுத்தக் குறியீடு",
    avgOht: "சராசரி தொட்டி நீர்மட்டம்",
    avgPress: "சராசரி குழாய் அழுத்தம்",
    citySal: "குடிநீர் உவர்ப்புத் தன்மை",
    cityBooster: "முக்கிய பூஸ்டர் பம்புகள்",
    cityTableTitle: "பதிவுசெய்யப்பட்ட நகர்ப்புற வீட்டு இணைப்புகள்",
    thPhone: "பயனர் கைபேசி / ID",
    thZone: "பயிர் மண்டலம்",
    thMoist: "மண் ஈரப்பதம்",
    thBorewell: "கிணற்று நீர்மட்டம்",
    thSalinity: "உவர்ப்புத் தன்மை (dS/m)",
    thFlow: "நீரோட்ட வேகம்",
    thStatus: "தற்போதைய நிலை",
    thWard: "வார்டு பகுதி",
    thTank: "தொட்டி நீர்மட்டம்",
    thPress: "விநியோக அழுத்தம்",
    thUsage: "தினசரி பயன்பாடு"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initChart();
  initFirebase();
  applyLanguageUI();
});

function switchLanguage(lang) {
  currentLang = lang;
  
  const btnEN = document.getElementById("btnLangEN");
  const btnTA = document.getElementById("btnLangTA");

  if (lang === "ta") {
    btnTA.className = "px-3 py-1 rounded-full text-xs font-extrabold bg-[#0284c7] text-white shadow-sm transition-all font-['Mukta_Malar']";
    btnEN.className = "px-3 py-1 rounded-full text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-all";
  } else {
    btnEN.className = "px-3 py-1 rounded-full text-xs font-extrabold bg-[#0284c7] text-white shadow-sm transition-all";
    btnTA.className = "px-3 py-1 rounded-full text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-all font-['Mukta_Malar']";
  }

  applyLanguageUI();
  if (loggedInIdentifier) {
    renderUI();
    renderOfficerTables();
  }
}

function applyLanguageUI() {
  const t = i18n[currentLang];

  const setT = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setT("lblAuthType", t.authType);
  setT("btnCitizenLabel", t.citizen);
  setT("btnOfficerLabel", t.officer);
  setT("lblSectorProfile", t.sectorProfile);
  setT("lblMobilePhone", t.mobilePhone);
  setT("lblJurisdiction", t.jurisdiction);
  setT("lblBadgeId", t.badgeId);
  setT("btnBackUser", t.back);
  setT("btnBackOfficer", t.back);
  setT("btnAccessDash", t.accessDash);
  setT("btnEnterCommand", t.enterCommand);
  setT("btnSignOut", t.signOut);

  setT("card1Label", t.waterStressScore);
  setT("lblTemp", t.temp);
  setT("lblHumidity", t.humidity);
  setT("lblSalinity", t.salinity);

  setT("cropMonitorSub", t.cropMonitorSub);
  setT("cropMonitorTitle", t.cropMonitorTitle);
  setT("weatherSub", t.weatherSub);
  setT("weatherTitle", t.weatherTitle);

  setT("lblLiveOpt", t.liveOpt);
  setT("lblTriggerBreakdown", t.triggerBreakdown);
  setT("lblActions", t.actionsRecs);
  setT("lblStressCtrl", t.stressCtrl);
  setT("lblStressSim", t.stressSim);
  setT("lblStressDesc", t.stressDesc);
  setT("txtNormalCond", t.normalCond);
  setT("txtDroughtCond", t.droughtCond);
  setT("lblCallInfo", t.callInfo);

  setT("villageSub", t.villageSub);
  setT("villageTitle", t.villageTitle);
  setT("lblClusterStress", t.clusterStress);
  setT("lblAvgBorewell", t.avgBorewell);
  setT("lblAvgTds", t.avgTds);
  setT("lblAvgSal", t.avgSal);
  setT("lblActivePumps", t.activePumps);
  setT("lblAgriTableTitle", t.agriTableTitle);

  setT("thAgriPhone", t.thPhone);
  setT("thAgriZone", t.thZone);
  setT("thAgriMoist", t.thMoist);
  setT("thAgriBore", t.thBorewell);
  setT("thAgriSal", t.thSalinity);
  setT("thAgriFlow", t.thFlow);
  setT("thAgriStatus", t.thStatus);

  setT("citySub", t.citySub);
  setT("cityTitle", t.cityTitle);
  setT("lblUrbanStress", t.urbanStress);
  setT("lblAvgOht", t.avgOht);
  setT("lblAvgPress", t.avgPress);
  setT("lblCitySal", t.citySal);
  setT("lblCityBooster", t.cityBooster);
  setT("lblCityTableTitle", t.cityTableTitle);

  setT("thCityPhone", t.thPhone);
  setT("thCityWard", t.thWard);
  setT("thCityTank", t.thTank);
  setT("thCityPress", t.thPress);
  setT("thCitySal", t.thSalinity);
  setT("thCityUsage", t.thUsage);
  setT("thCityStatus", t.thStatus);
}

function initChart() {
  const canvas = document.getElementById("telemetryChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  telemetryChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
      datasets: [
        {
          label: "Primary Reservoir / Borewell Level",
          data: [68, 67, 66, 65, 65, 65],
          borderColor: "#0284c7",
          backgroundColor: "rgba(2, 132, 199, 0.08)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Soil Moisture (%) / Pipe Pressure (bar)",
          data: [50, 48, 47, 46, 45, 45],
          borderColor: "#10b981",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
    },
  });
}

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDINw6_BJPw2Vtl2w2X_M-WeD0jKo_eqtI",
    authDomain: "aqua-nexus-rtdb.firebaseapp.com",
    databaseURL: "https://aqua-nexus-rtdb-default-rtdb.firebaseio.com",
    projectId: "aqua-nexus-rtdb",
    storageBucket: "aqua-nexus-rtdb.firebasestorage.app",
    messagingSenderId: "291717628063",
    appId: "1:291717628063:web:0694a7af8e27fa5d8662aa"
  };

  try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      const database = firebase.database();
      const telemetryRef = database.ref('telemetry/live');
      
      telemetryRef.on('value', (snapshot) => {
        const liveData = snapshot.val();
        if (liveData) {
          currentData.temp = liveData.temp !== undefined ? liveData.temp : currentData.temp;
          currentData.humidity = liveData.humidity !== undefined ? liveData.humidity : currentData.humidity;
          currentData.soilMoisture = liveData.soilMoisture !== undefined ? liveData.soilMoisture : currentData.soilMoisture;
          currentData.borewellLevel = liveData.borewellLevel !== undefined ? liveData.borewellLevel : currentData.borewellLevel;
          currentData.tankLevel = liveData.tankLevel !== undefined ? liveData.tankLevel : currentData.tankLevel;
          currentData.pipelinePressure = liveData.pipelinePressure !== undefined ? liveData.pipelinePressure : currentData.pipelinePressure;
          currentData.tds = liveData.tds !== undefined ? liveData.tds : currentData.tds;
          currentData.salinity = liveData.salinity !== undefined ? liveData.salinity : currentData.salinity;
          currentData.rain = liveData.rain !== undefined ? liveData.rain : currentData.rain;
          currentData.usage = liveData.usage !== undefined ? liveData.usage : currentData.usage;
          currentData.leakStatus = liveData.leakStatus || currentData.leakStatus;

          let calculatedStress = Math.min(100, Math.max(0, Math.round(
            (100 - currentData.soilMoisture) * 0.4 +
            (currentData.temp > 35 ? 30 : 10) +
            (currentData.salinity > 1.2 ? 30 : 0)
          )));
          currentData.stressScore = liveData.stressScore !== undefined ? liveData.stressScore : calculatedStress;

          if (loggedInIdentifier) {
            renderUI();
            renderOfficerTables();
          }
        }
      });
    }
  } catch (e) {
    console.error("Firebase connection error: ", e);
  }
}

function goToStep2(mainRole) {
  currentMainRole = mainRole;
  document.getElementById("loginStep1").classList.add("hidden");

  if (mainRole === "user") {
    currentSubRole = "agriculture";
    document.getElementById("loginStep2User").classList.remove("hidden");
    document.getElementById("loginSubtitle").innerText = "Configure citizen water application profile";
  } else {
    currentSubRole = "village";
    document.getElementById("loginStep2Officer").classList.remove("hidden");
    document.getElementById("loginSubtitle").innerText = "Enter officer credentials and jurisdiction";
  }
}

function backToStep1() {
  document.getElementById("loginStep1").classList.remove("hidden");
  document.getElementById("loginStep2User").classList.add("hidden");
  document.getElementById("loginStep2Officer").classList.add("hidden");
  document.getElementById("loginSubtitle").innerText = "Select your account authorization type";
}

function setSubRole(mainRole, subRole) {
  currentSubRole = subRole;

  if (mainRole === "user") {
    document.getElementById("btnSubAgri").className = subRole === "agriculture"
      ? "py-3 px-4 rounded-2xl font-extrabold text-xs border border-[#0284c7] bg-sky-50 text-[#0284c7]"
      : "py-3 px-4 rounded-2xl font-extrabold text-xs border border-slate-200 bg-slate-100 text-slate-600";

    document.getElementById("btnSubHouse").className = subRole === "house"
      ? "py-3 px-4 rounded-2xl font-extrabold text-xs border border-[#0284c7] bg-sky-50 text-[#0284c7]"
      : "py-3 px-4 rounded-2xl font-extrabold text-xs border border-slate-200 bg-slate-100 text-slate-600";
  } else {
    document.getElementById("btnSubVillage").className = subRole === "village"
      ? "py-3 px-4 rounded-2xl font-extrabold text-xs border border-emerald-600 bg-emerald-50 text-emerald-800"
      : "py-3 px-4 rounded-2xl font-extrabold text-xs border border-slate-200 bg-slate-100 text-slate-600";

    document.getElementById("btnSubCity").className = subRole === "city"
      ? "py-3 px-4 rounded-2xl font-extrabold text-xs border border-indigo-600 bg-indigo-50 text-indigo-800"
      : "py-3 px-4 rounded-2xl font-extrabold text-xs border border-slate-200 bg-slate-100 text-slate-600";
  }
}

function handleFinalLogin(event, mainRole) {
  if (event) event.preventDefault();

  if (mainRole === "user") {
    const phone = document.getElementById("userPhoneInput").value.trim();
    if (!phone) return alert("Please enter your mobile phone number.");
    loggedInIdentifier = phone;
  } else {
    const officerId = document.getElementById("officerIdInput").value.trim();
    if (!officerId) return alert("Please enter your Official Mobile ID.");
    loggedInIdentifier = officerId;
  }

  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }

  const sessionBadge = document.getElementById("userSessionBadge");
  if (sessionBadge) {
    sessionBadge.innerText = `${loggedInIdentifier} (${currentSubRole.toUpperCase()})`;
  }

  applyViewAndTheme();
}

function logout() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  }
  backToStep1();
}

function applyViewAndTheme() {
  const pageUser = document.getElementById("pageUser");
  const pageVillage = document.getElementById("pageVillage");
  const pageCity = document.getElementById("pageCity");
  const body = document.getElementById("mainBody");

  pageUser.classList.add("hidden");
  pageVillage.classList.add("hidden");
  pageCity.classList.add("hidden");

  if (currentMainRole === "user") {
    pageUser.classList.remove("hidden");
    if (currentSubRole === "agriculture") {
      body.className = "font-['Sora'] min-h-screen text-slate-800 bg-cover bg-center bg-fixed transition-all duration-700 bg-agri-full";
    } else {
      body.className = "font-['Sora'] min-h-screen text-slate-800 bg-cover bg-center bg-fixed transition-all duration-700 bg-house-full";
    }
    renderUI();
  } else {
    if (currentSubRole === "village") {
      pageVillage.classList.remove("hidden");
      body.className = "font-['Sora'] min-h-screen text-slate-800 bg-cover bg-center bg-fixed transition-all duration-700 bg-agri-full";
      renderOfficerTables();
    } else {
      pageCity.classList.remove("hidden");
      body.className = "font-['Sora'] min-h-screen text-slate-800 bg-cover bg-center bg-fixed transition-all duration-700 bg-house-full";
      renderOfficerTables();
    }
  }
}

// Outbound Voice Call Dispatcher via GitHub Pages TwiML URL
function triggerVoiceCallAlert(englishMessage, tamilMessage) {
  const now = Date.now();
  if (now - lastVoiceAlertTime < 15000) return;
  lastVoiceAlertTime = now;

  let targetPhone = loggedInIdentifier.replace(/\s+/g, '');
  if (!targetPhone.startsWith('+')) {
    targetPhone = '+91' + targetPhone;
  }

  console.log(`Initiating Direct Twilio Call to target number: ${targetPhone}`);

  const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;

  const formData = new URLSearchParams();
  formData.append('To', targetPhone);
  formData.append('From', TWILIO_PHONE_NUMBER);
  formData.append('Url', 'https://sheikramiz.github.io/Aqua-Nexus/voice.xml');

  fetch(twilioApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
  .then(res => res.json())
  .then(data => console.log('Twilio Call Response:', data))
  .catch(err => console.error('Call Request Error:', err));

  // Local Web Speech Fallback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const uttEN = new SpeechSynthesisUtterance(englishMessage);
    uttEN.lang = 'en-IN';
    const uttTA = new SpeechSynthesisUtterance(tamilMessage);
    uttTA.lang = 'ta-IN';
    window.speechSynthesis.speak(uttEN);
    window.speechSynthesis.speak(uttTA);
  }
}

function setScenario(type) {
  currentScenario = type;
  const btnNormal = document.getElementById("btnNormal");
  const btnElNino = document.getElementById("btnElNino");

  if (type === "elnino") {
    btnElNino.className = "w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-md transition-all flex justify-between items-center";
    btnNormal.className = "w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-200 text-slate-700 hover:bg-emerald-500 hover:text-white transition-all flex justify-between items-center";

    currentData = {
      stressScore: 84,
      daysRemaining: 1.8,
      tankLevel: 32,
      borewellLevel: 28,
      temp: 38.5,
      humidity: 24,
      soilMoisture: 21,
      pipelinePressure: 0.8,
      tds: 1380,
      salinity: 2.15,
      rain: 0,
      leakStatus: "HIGH FLOW LOSS",
      usage: 420,
    };

    cropsData[0].deliveredLiters = 500;
    cropsData[1].deliveredLiters = 400;
    cropsData[2].deliveredLiters = 100;
  } else {
    btnNormal.className = "w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-emerald-500 text-white shadow-md transition-all flex justify-between items-center";
    btnElNino.className = "w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-200 text-slate-700 hover:bg-red-500 hover:text-white transition-all flex justify-between items-center";

    currentData = {
      stressScore: 28,
      daysRemaining: 8.5,
      tankLevel: 78,
      borewellLevel: 65,
      temp: 29.2,
      humidity: 62,
      soilMoisture: 45,
      pipelinePressure: 2.4,
      tds: 320,
      salinity: 0.5,
      rain: 0,
      leakStatus: "NO LEAK",
      usage: 180,
    };

    cropsData[0].deliveredLiters = 850;
    cropsData[1].deliveredLiters = 950;
    cropsData[2].deliveredLiters = 220;
  }

  renderUI();
  renderOfficerTables();
}

function renderCropRequirementCards() {
  const container = document.getElementById("cropCardsGrid");
  const panel = document.getElementById("cropRequirementPanel");
  if (!container) return;

  const t = i18n[currentLang];

  if (currentSubRole !== "agriculture") {
    if (panel) panel.classList.add("hidden");
    return;
  } else {
    if (panel) panel.classList.remove("hidden");
  }

  let html = "";
  cropsData.forEach((crop) => {
    const required = crop.targetRequiredLiters;
    const delivered = crop.deliveredLiters;
    const waterNeeded = Math.max(0, required - delivered);
    const progressPercent = Math.min(100, Math.round((delivered / required) * 100));

    const cropName = currentLang === "ta" ? crop.nameTa : crop.nameEn;
    let statusBadge = "";
    let summaryMessage = "";

    if (waterNeeded > 0) {
      statusBadge = `<span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-full border border-amber-200">${t.irrigationNeeded}</span>`;
      summaryMessage = currentLang === "ta" 
        ? `இந்த பயிர்க்கு தற்போது <strong>${delivered} லிட்டர்</strong> வழங்கப்பட்டுள்ளது, மேலும் <strong>${waterNeeded} லிட்டர்</strong> தேவைப்படுகிறது.`
        : `This crop currently has <strong>${delivered} L</strong> delivered and needs <strong>${waterNeeded} L</strong> more water.`;
    } else {
      statusBadge = `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full border border-emerald-200">${t.fullyHydrated}</span>`;
      summaryMessage = currentLang === "ta"
        ? `இந்த பயிர் அதன் இலக்கான <strong>${required} லிட்டர்</strong> நீரை அடைந்துவிட்டது.`
        : `This crop has reached its target of <strong>${required} L</strong>.`;
    }

    html += `
      <div class="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${crop.icon}</span>
            <h4 class="font-extrabold text-slate-800 text-sm">${cropName}</h4>
          </div>
          ${statusBadge}
        </div>

        <div class="space-y-2 text-xs font-semibold text-slate-600">
          <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span>${t.waterReqPlant}</span>
            <span class="font-bold text-slate-800">${required} ${t.litersDay}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span>${t.waterDelivered}</span>
            <span class="font-bold text-sky-600">${delivered} ${t.liters}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span>${t.waterNeeded}</span>
            <span class="font-extrabold ${waterNeeded > 0 ? 'text-amber-600' : 'text-emerald-600'}">${waterNeeded} ${t.liters}</span>
          </div>
          <div class="flex justify-between pb-1">
            <span>${t.totalVolUsed}</span>
            <span class="font-bold text-slate-800">${required} ${t.liters}</span>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>${t.hydrationProg}</span>
            <span>${progressPercent}%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div class="${waterNeeded > 0 ? 'bg-amber-500' : 'bg-emerald-500'} h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="p-3 bg-white rounded-xl text-xs text-slate-600 font-medium border border-slate-200/80">
          💡 ${summaryMessage}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderUI() {
  const d = currentData;
  const isAgri = currentSubRole === "agriculture";
  const t = i18n[currentLang];

  document.getElementById("waterStressScore").innerHTML = `${d.stressScore}<span class="text-lg text-slate-400">/100</span>`;
  document.getElementById("daysRemaining").innerHTML = `${d.daysRemaining} <span class="text-lg text-slate-500 font-semibold">${currentLang === 'ta' ? 'நாட்கள்' : 'Days'}</span>`;
  document.getElementById("tankLevel").innerText = `${d.tankLevel}%`;
  document.getElementById("tempVal").innerText = `${d.temp} °C`;
  document.getElementById("humidityVal").innerText = `${d.humidity} %`;

  document.getElementById("stressBar").style.width = `${d.stressScore}%`;
  document.getElementById("tankBar").style.width = `${d.tankLevel}%`;

  document.getElementById("salinityVal").innerText = `${d.salinity} dS/m`;
  const salinityBadge = document.getElementById("salinityBadge");
  if (d.salinity > 1.5) {
    salinityBadge.innerText = t.highSalinity;
    salinityBadge.className = "text-[10px] font-extrabold text-red-600 block mt-0.5";
  } else {
    salinityBadge.innerText = t.safeFresh;
    salinityBadge.className = "text-[10px] font-extrabold text-emerald-600 block mt-0.5";
  }

  if (isAgri) {
    document.getElementById("appModeBadge").innerText = t.modeAgri;
    document.getElementById("telemetryTitle").innerText = t.liveAgriTel;
    document.getElementById("reservesLabel").innerText = t.farmReserves;
    document.getElementById("reservesSubtext").innerText = t.farmReservesSub;
    document.getElementById("storageLabel").innerText = t.storageSump;
    document.getElementById("borewellLabel").innerText = t.borewellLevel;
    document.getElementById("borewellLevel").innerHTML = `${d.borewellLevel} <span class="text-lg text-slate-500 font-semibold">cm</span>`;
    document.getElementById("groundwaterTrend").innerText = d.stressScore > 70 ? t.depletionWarn : t.safeAquifer;

    document.getElementById("metric2Label").innerText = t.soilMoisture;
    document.getElementById("metric2Val").innerText = `${d.soilMoisture} %`;

    document.getElementById("tdsLabel").innerText = t.waterTds;
    document.getElementById("tdsVal").innerText = `${d.tds} PPM`;

    document.getElementById("metric4Label").innerText = t.rainfall;
    document.getElementById("metric4Val").innerText = `${d.rain} mm/hr`;

    document.getElementById("usageLabel").innerText = t.waterFlow;
    document.getElementById("usageVal").innerText = `${d.usage} L/hr`;

    document.getElementById("decisionContextLabel").innerText = t.aiAgriEngine;
    document.getElementById("graphTitle").innerText = t.graphTitleAgri;
  } else {
    document.getElementById("appModeBadge").innerText = t.modeHouse;
    document.getElementById("telemetryTitle").innerText = t.liveHouseTel;
    document.getElementById("reservesLabel").innerText = t.houseAutonomy;
    document.getElementById("reservesSubtext").innerText = t.houseAutonomySub;
    document.getElementById("storageLabel").innerText = t.ohtLevel;
    document.getElementById("borewellLabel").innerText = t.supplyPressure;
    document.getElementById("borewellLevel").innerHTML = `${d.pipelinePressure} <span class="text-lg text-slate-500 font-semibold">bar</span>`;
    document.getElementById("groundwaterTrend").innerText = d.pipelinePressure < 1.0 ? t.lowPressWarn : t.optPress;

    document.getElementById("metric2Label").innerText = t.pipePressure;
    document.getElementById("metric2Val").innerText = `${d.pipelinePressure} bar`;

    document.getElementById("tdsLabel").innerText = t.waterTds;
    document.getElementById("tdsVal").innerText = `${d.tds} PPM`;

    document.getElementById("metric4Label").innerText = t.leakStatus;
    document.getElementById("metric4Val").innerText = d.leakStatus;

    document.getElementById("usageLabel").innerText = t.dailyUsage;
    document.getElementById("usageVal").innerText = `${d.usage} L/day`;

    document.getElementById("decisionContextLabel").innerText = t.aiHouseEngine;
    document.getElementById("graphTitle").innerText = t.graphTitleHouse;
  }

  renderCropRequirementCards();

  const diodeLight = document.getElementById("diodeLight");
  const statusBadge = document.getElementById("statusBadge");
  const title = document.getElementById("decisionStatusTitle");
  const reason = document.getElementById("decisionReason");
  const list = document.getElementById("recommendationList");

  if (d.stressScore > 70 || d.salinity > 1.5) {
    diodeLight.className = "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse";
    statusBadge.innerText = t.criticalStress;

    const englishAlert = isAgri 
      ? `Critical drought detected on your farm. High salinity level of ${d.salinity} dS per meter.`
      : `Critical water shortage detected in your overhead tank. High salinity level.`;

    const tamilAlert = isAgri
      ? `உங்கள் பண்ணையில் கடுமையான வறட்சி கண்டறியப்பட்டுள்ளது. உப்புத்தன்மை ${d.salinity} dS/m ஆக உள்ளது.`
      : `உங்கள் தண்ணீர் தொட்டியில் கடுமையான நீர் தட்டுப்பாடு கண்டறியப்பட்டுள்ளது.`;

    triggerVoiceCallAlert(englishAlert, tamilAlert);

    if (isAgri) {
      title.innerText = t.critDrought;
      reason.innerText = currentLang === 'ta' 
        ? "அதிக வெப்பநிலை, குறைந்த ஈரப்பதம் மற்றும் அதிக உவர்ப்புத்ன்மை கண்டறியப்பட்டுள்ளது."
        : "High field temperature, low humidity, low soil moisture, and high salinity detected.";
      list.innerHTML = currentLang === 'ta' ? `
        <li class="flex items-center gap-2">⚠️ அவசியமற்ற பாசனம் தானாகவே பூட்டப்பட்டது.</li>
        <li class="flex items-center gap-2">⚠️ மண்டலம் B சொட்டு நீர் பாசனத்திற்கு மாற்றப்பட்டது.</li>
      ` : `
        <li class="flex items-center gap-2">⚠️ Non-essential irrigation locked out automatically.</li>
        <li class="flex items-center gap-2">⚠️ Zone B (Vegetables) switched to micro-drip rationed mode.</li>
      `;
    } else {
      title.innerText = t.critHouse;
      reason.innerText = currentLang === 'ta'
        ? "தொட்டி நீர்மட்டம் குறைவாகவும் உவர்ப்புத் தன்மை அதிகமாகவும் உள்ளது."
        : "Overhead tank level low with high salinity and sustained usage.";
      list.innerHTML = currentLang === 'ta' ? `
        <li class="flex items-center gap-2">⚠️ அவசியமற்ற வீட்டு உபயோக குழாய்கள் பூட்டப்பட்டன.</li>
      ` : `
        <li class="flex items-center gap-2">⚠️ Non-essential domestic outlets locked out.</li>
      `;
    }
  } else {
    diodeLight.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
    statusBadge.innerText = t.systemNormal;

    if (isAgri) {
      title.innerText = t.optAllocation;
      reason.innerText = currentLang === 'ta'
        ? "மிதமான வெப்பநிலை மற்றும் பாதுகாப்பான மண் ஈரப்பதம் நிலவுகிறது."
        : "Moderate temperatures, stable humidity, and safe soil moisture levels detected.";
      list.innerHTML = currentLang === 'ta' ? `
        <li class="flex items-center gap-2">✓ வழக்கமான முறையில் பாசன பம்ப் இயங்குகிறது.</li>
      ` : `
        <li class="flex items-center gap-2">✓ Main irrigation pump operating on standard schedule.</li>
      `;
    } else {
      title.innerText = t.optHouse;
      reason.innerText = currentLang === 'ta'
        ? "நீர் தொட்டி போதுமான அளவில் நிரம்பியுள்ளது மற்றும் அழுத்தம் சீராக உள்ளது."
        : "Overhead tank adequately filled and pipe pressure stable.";
      list.innerHTML = currentLang === 'ta' ? `
        <li class="flex items-center gap-2">✓ தொட்டி தானியங்கி நிரப்புதல் இயல்பாக உள்ளது.</li>
      ` : `
        <li class="flex items-center gap-2">✓ Overhead tank automated auto-fill pump cycle normal.</li>
      `;
    }
  }

  if (telemetryChart) {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (telemetryChart.data.labels.length > 8) {
      telemetryChart.data.labels.shift();
      telemetryChart.data.datasets[0].data.shift();
      telemetryChart.data.datasets[1].data.shift();
    }
    telemetryChart.data.labels.push(now);
    telemetryChart.data.datasets[0].data.push(isAgri ? d.borewellLevel : d.tankLevel);
    telemetryChart.data.datasets[1].data.push(isAgri ? d.soilMoisture : d.pipelinePressure);
    telemetryChart.update();
  }
}

function renderOfficerTables() {
  const agriUsers = [
    { phone: loggedInIdentifier ? `${loggedInIdentifier} (Active Node)` : "+91 95972 68190", zone: "Zone 1 - Field A", moisture: `${currentData.soilMoisture}%`, borewell: `${currentData.borewellLevel} cm`, salinity: `${currentData.salinity}`, flow: `${currentData.usage} L/hr`, stress: currentData.stressScore },
    { phone: "+91 98401 12345", zone: "Zone 2 - Paddy", moisture: "48%", borewell: "68 cm", salinity: "0.52", flow: "210 L/hr", stress: 24 },
    { phone: "+91 97102 88391", zone: "Zone 3 - Sugarcane", moisture: "38%", borewell: "54 cm", salinity: "0.78", flow: "190 L/hr", stress: 42 }
  ];

  let agriTableHtml = "";
  let totalAgriStress = 0, totalBorewell = 0, totalAgriSalinity = 0, totalAgriTds = 0;

  agriUsers.forEach(u => {
    totalAgriStress += u.stress;
    totalBorewell += parseInt(u.borewell);
    totalAgriSalinity += parseFloat(u.salinity);
    totalAgriTds += currentData.tds;

    const isDanger = u.stress > 70 || parseFloat(u.salinity) > 1.5;
    const statusBadge = isDanger 
      ? `<span class="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-extrabold rounded-full">CRITICAL</span>`
      : `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full">NORMAL</span>`;

    agriTableHtml += `
      <tr>
        <td class="p-3.5 font-bold">${u.phone}</td>
        <td class="p-3.5">${u.zone}</td>
        <td class="p-3.5">${u.moisture}</td>
        <td class="p-3.5">${u.borewell}</td>
        <td class="p-3.5 font-semibold">${u.salinity}</td>
        <td class="p-3.5">${u.flow}</td>
        <td class="p-3.5">${statusBadge}</td>
      </tr>
    `;
  });

  const bodyAgri = document.getElementById("agriUsersTableBody");
  if (bodyAgri) bodyAgri.innerHTML = agriTableHtml;
  
  const elemAgriStress = document.getElementById("agriAvgStress");
  if (elemAgriStress) elemAgriStress.innerText = `${Math.round(totalAgriStress / agriUsers.length)}/100`;

  const cityUsers = [
    { phone: loggedInIdentifier ? `${loggedInIdentifier} (Active Node)` : "+91 95972 68190", ward: "Ward 4 - Flat 3B", tank: `${currentData.tankLevel}%`, pressure: `${currentData.pipelinePressure} bar`, salinity: `${currentData.salinity}`, usage: `${currentData.usage} L/day`, stress: currentData.stressScore },
    { phone: "+91 98840 99182", ward: "Ward 4 - Flat 1A", tank: "82%", pressure: "2.6 bar", salinity: "0.42", usage: "160 L/day", stress: 20 }
  ];

  let cityTableHtml = "";
  cityUsers.forEach(u => {
    const isDanger = u.stress > 70 || parseFloat(u.salinity) > 1.5;
    const statusBadge = isDanger 
      ? `<span class="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-extrabold rounded-full">CRITICAL</span>`
      : `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full">NORMAL</span>`;

    cityTableHtml += `
      <tr>
        <td class="p-3.5 font-bold">${u.phone}</td>
        <td class="p-3.5">${u.ward}</td>
        <td class="p-3.5">${u.tank}</td>
        <td class="p-3.5">${u.pressure}</td>
        <td class="p-3.5 font-semibold">${u.salinity}</td>
        <td class="p-3.5">${u.usage}</td>
        <td class="p-3.5">${statusBadge}</td>
      </tr>
    `;
  });

  const bodyCity = document.getElementById("cityUsersTableBody");
  if (bodyCity) bodyCity.innerHTML = cityTableHtml;
}
