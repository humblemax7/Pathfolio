import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useApp } from "../context/AppContext";
import T from "../components/T";
import Pill from "../components/Pill";

export default function AchievementsScreen() {
  const { theme, t } = useApp();
  const c = theme.colors;

  const badges = [
    { label: "Getting Started", earned: true },
    { label: "1-Week Streak", earned: false },
    { label: "Math Master", earned: false },
    { label: "Science Star", earned: false },
    { label: "Planner Pro", earned: false },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Image source={require("../../assets/logo.png")} style={{ width: 60, height: 60, borderRadius: 30, opacity: 0.9 }} resizeMode="contain" />
      </View>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <T style={[styles.heading, { color: c.primary }]}>{t("badges_title")}</T>
        <T style={{ color: c.subText, marginBottom: 12 }}>{t("current_streak")}: 0</T>

        <View style={styles.badgeGrid}>
          {badges.map((b, i) => (
            <Pill key={i} text={b.label} type={b.earned ? "ok" : "neutral"} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: "900", marginBottom: 8 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
});
