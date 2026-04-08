import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function Pill({ text, type = "neutral" }) {
  // ensure it's a visible string
  const msg = String(text ?? "").trim() || "—";

  const palette = {
    neutral: { bg: "#eef5ff", fg: "#0b1f44", bd: "#c7d8ff" },
    ok:      { bg: "#e9fbf2", fg: "#075a37", bd: "#baf2d4" },
    warn:    { bg: "#fff4d9", fg: "#6b4300", bd: "#ffdca2" },
    bad:     { bg: "#ffe9ea", fg: "#8a1720", bd: "#ffc6cb" },
  };
  const { bg, fg, bd } = palette[type] || palette.neutral;

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[styles.txt, { color: fg }]} numberOfLines={2}>
        {msg}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  txt: {
    fontSize: 15,
    fontWeight: "800",
  },
});
