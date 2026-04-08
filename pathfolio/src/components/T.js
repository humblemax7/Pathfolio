// src/components/T.js
import React from "react";
import { Text } from "react-native";
import { useApp } from "../context/AppContext";
import { speakTTS } from "../utils/tts";

/**
 * T = Text with optional long-press TTS, but NO layout/style changes.
 * - Renders a plain <Text> (no Pressable wrapping, no default styles).
 * - Long-press triggers TTS; single tap behavior remains exactly as before.
 * - Pass `ttsText` to override what is spoken (useful for "PATHFOLIO" → "Pathfolio").
 */
export default function T({ children, ttsText, onLongPress, ...props }) {
  const { settings } = useApp();

  const phrase =
    typeof ttsText === "string"
      ? ttsText
      : typeof children === "string"
      ? children.replace(/_/g, " ").replace(/\s+/g, " ").trim()
      : "";

  const lang = settings.language === "es" ? "es-US" : "en-US";

  const handleLongPress = (e) => {
    if (settings.ttsEnabled && phrase) {
      speakTTS(phrase, { lang });
    }
    if (onLongPress) onLongPress(e);
  };

  return (
    <Text onLongPress={handleLongPress} delayLongPress={250} {...props}>
      {children}
    </Text>
  );
}
