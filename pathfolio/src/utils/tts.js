// src/utils/tts.js
import { Platform } from "react-native";
import * as Speech from "expo-speech";

const isWeb = Platform.OS === "web";

export function stopTTS() {
  try {
    if (isWeb && "speechSynthesis" in window) window.speechSynthesis.cancel();
    else Speech.stop();
  } catch {}
}

export function speakTTS(text, { lang = "en-US", rate = 0.98, pitch = 1.0, volume = 1.0 } = {}) {
  if (!text || !String(text).trim()) return;
  stopTTS();
  // Normalize underscores / extra spaces
  const msg = String(text).replace(/_/g, " ").replace(/\s+/g, " ").trim();

  if (isWeb && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
    return;
  }
  Speech.speak(msg, { language: lang, rate, pitch, volume });
}
