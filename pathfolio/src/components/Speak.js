import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useApp } from "../context/AppContext";

export default function Speak({ text, size=18, color="#1d2636" }){
  const { settings } = useApp();
  const onPress = ()=>{
    if(!settings.ttsEnabled || !text) return;
    const lang = settings.language === "es" ? "es-US" : "en-US";
    Speech.speak(text, { language: lang, rate: 1.0, pitch: 1.0 });
  };
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.btn} accessibilityRole="button" accessibilityLabel="Read aloud">
      <Ionicons name="volume-high" size={size} color={color} />
    </Pressable>
  );
}
const styles = StyleSheet.create({ btn:{ marginLeft:6 } });
