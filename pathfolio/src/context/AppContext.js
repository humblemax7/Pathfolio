// src/context/AppContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const STRINGS = {
  en: {
    // Home
    home_sub: "Your path to success",
    greet: "Welcome",
    btn_grad: "Graduation Tracker",
    btn_career: "Career Paths",
    btn_planner: "Milestone Planner",
    btn_whatif: "What-If Simulator",
    btn_badges: "Progress Badges",

    // Grad
    grad_choose_state: "1) Choose Your State",
    state_label: "State",
    grad_enter_credits: "2) Enter Credits",
    requirement_status: "3) Requirement Status",
    suggestions: "Smart Suggestions",
    next_career: "Next: Career Paths →",
    english: "English",
    math: "Math",
    science: "Science",
    social: "Social Studies",
    arts: "Arts / Electives",
    pe: "PE / Health",
    calculate: "Calculate",

    // Career
    choose_career: "Choose a Career Path",
    learn_more: "Learn more about each path",
    rec_classes: "Recommended Classes",
    rec_clubs: "Clubs",
    rec_comps: "Competitions",
    testing_deadlines: "Testing Dates & Windows",
    confirm_dates: "Confirm dates with test providers.",
    career_intro_title: "Explore Career Paths",
    career_intro_body:
      "We’ll show typical classes, clubs, competitions, and timelines for each path. Confirm details locally with your school.",
    career_intro_ready: "I’m ready to continue",
    career_intro_dont: "Don’t show this again",

    // What-If
    whatif_title: "What-If Simulator",
    gpa_u: "Unweighted GPA",
    gpa_w: "Weighted GPA",
    ap_count: "AP/IB Courses",
    ec_level: "Extracurricular Level",
    score_out_of: "Score out of",
    outlook_needs: "Outlook & needs",

    // Planner
    planner_title: "Milestone Planner",
    add_milestone: "Add Milestone",
    percent_complete: "Percent Complete",
    timeline_title: "Timeline",
    due_label: "Due",
    in_progress: "In Progress",

    // Badges
    badges_title: "Progress Badges",
    current_streak: "Current Streak",

    // Settings
    settings_title: "Settings & Accessibility",
    language: "Language",
    english_lang: "English",
    spanish_lang: "Spanish",
    tts_label: "Read text aloud (TTS)",
    hc_label: "High Contrast",
    hc_mode: "High Contrast Mode",
    hc_light: "High Contrast (Light)",
    hc_dark: "High Contrast (Dark)",
    profile_title: "Profile",
    your_name: "Your Name",
    default_state: "Default State",
    save: "Save",
    saved_toast: "Settings saved",
  },

  es: {
    // Home
    home_sub: "Tu camino hacia el éxito",
    greet: "Bienvenido",
    btn_grad: "Requisitos de Graduación",
    btn_career: "Rutas Profesionales",
    btn_planner: "Planificador de Hitos",
    btn_whatif: "Simulador ¿Qué pasaría si?",
    btn_badges: "Insignias de Progreso",

    // Grad
    grad_choose_state: "1) Elige tu estado",
    state_label: "Estado",
    grad_enter_credits: "2) Ingresa tus créditos",
    requirement_status: "3) Estado de Requisitos",
    suggestions: "Sugerencias Inteligentes",
    next_career: "Siguiente: Rutas Profesionales →",
    english: "Inglés",
    math: "Matemáticas",
    science: "Ciencias",
    social: "Estudios Sociales",
    arts: "Artes / Optativas",
    pe: "Educ. Física / Salud",
    calculate: "Calcular",

    // Career
    choose_career: "Elige una ruta profesional",
    learn_more: "Conoce más sobre cada ruta",
    rec_classes: "Clases recomendadas",
    rec_clubs: "Clubes",
    rec_comps: "Competencias",
    testing_deadlines: "Fechas y periodos de exámenes",
    confirm_dates: "Confirma fechas con los proveedores.",
    career_intro_title: "Explora Rutas Profesionales",
    career_intro_body:
      "Mostramos clases, clubes, competencias y cronogramas típicos. Confirma detalles localmente con tu escuela.",
    career_intro_ready: "Listo para continuar",
    career_intro_dont: "No mostrar de nuevo",

    // What-If
    whatif_title: "Simulador ¿Qué pasaría si?",
    gpa_u: "GPA sin ponderar",
    gpa_w: "GPA ponderado",
    ap_count: "Cursos AP/IB",
    ec_level: "Nivel de actividades",
    score_out_of: "Puntuación de",
    outlook_needs: "Panorama y necesidades",

    // Planner
    planner_title: "Planificador de Hitos",
    add_milestone: "Agregar Hito",
    percent_complete: "Porcentaje Completo",
    timeline_title: "Cronograma",
    due_label: "Fecha",
    in_progress: "En Progreso",

    // Badges
    badges_title: "Insignias de Progreso",
    current_streak: "Racha Actual",

    // Settings
    settings_title: "Configuración y accesibilidad",
    language: "Idioma",
    english_lang: "Inglés",
    spanish_lang: "Español",
    tts_label: "Leer texto en voz alta (TTS)",
    hc_label: "Alto Contraste",
    hc_mode: "Modo de Alto Contraste",
    hc_light: "Alto Contraste (Claro)",
    hc_dark: "Alto Contraste (Oscuro)",
    profile_title: "Perfil",
    your_name: "Tu Nombre",
    default_state: "Estado predeterminado",
    save: "Guardar",
    saved_toast: "Configuración guardada",
  },
};

/** Themes */
const BASE_LIGHT = {
  primary: "#184aa6",
  background: "#f6f8fc",
  card: "#ffffff",
  text: "#1d2636",
  subText: "#5f6b85",
  border: "#e5e9f3",
  notification: "#ff3b30",
};

// High-contrast light
const HC_LIGHT = {
  primary: "#0037ff",
  background: "#ffffff",
  card: "#ffffff",
  text: "#000000",
  subText: "#111111",
  border: "#000000",
  notification: "#ff0000",
};

// High-contrast dark 
const HC_DARK = {
  primary: "#ffd400",
  background: "#000000",
  card: "#000000",
  text: "#ffffff",
  subText: "#e6e6e6",
  border: "#ffffff",
  notification: "#ff4d4d",
};

function makeTheme(settings) {
  if (settings.highContrast) {
    return settings.highContrastMode === "dark"
      ? { colors: HC_DARK }
      : { colors: HC_LIGHT };
  }
  return { colors: BASE_LIGHT };
}

/** Context */
const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState({
    language: "en",
    ttsEnabled: true,
    highContrast: false,
    highContrastMode: "light",
    showCareerIntro: true,
  });

  const [profile, setProfile] = useState({
    name: "",
    state: null,
    career: null,
    credits: null,
    gpa: null,
  });


  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem("@pathfolio:settings");
        if (s) setSettings((prev) => ({ ...prev, ...JSON.parse(s) }));
        const p = await AsyncStorage.getItem("@pathfolio:profile");
        if (p) setProfile((prev) => ({ ...prev, ...JSON.parse(p) }));
      } catch {}
    })();
  }, []);


  useEffect(() => {
    AsyncStorage.setItem("@pathfolio:settings", JSON.stringify(settings)).catch(() => {});
  }, [settings]);
  useEffect(() => {
    AsyncStorage.setItem("@pathfolio:profile", JSON.stringify(profile)).catch(() => {});
  }, [profile]);

  const theme = useMemo(
    () => makeTheme(settings),
    [settings.highContrast, settings.highContrastMode]
  );

  const t = (key) => {
    const dict = STRINGS[settings.language] || STRINGS.en;
    return dict[key] || key;
  };

  return (
    <AppCtx.Provider value={{ settings, setSettings, profile, setProfile, theme, t }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
