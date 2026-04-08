import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import T from "../components/T";

export default function HomeScreen() {
  const { theme, t, profile } = useApp();
  const c = theme.colors;
  const nav = useNavigation();

  const Btn = ({ label, to }) => (
    <Pressable onPress={() => nav.navigate(to)} style={[styles.btn, { backgroundColor: c.card, borderColor: c.border }]}>
      <T style={[styles.btnText, { color: c.text }]}>{label}</T>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <Image source={require("../../assets/logo.png")} style={{ width: 120, height: 120, borderRadius: 24 }} resizeMode="contain" />
        <T style={[styles.title, { color: c.primary }]}>PATHFOLIO</T>
        <T style={{ color: c.subText }}>
          {t("greet")}{profile.name ? `, ${profile.name}` : ""} — {t("home_sub")}
        </T>
      </View>

      <Btn label={t("btn_grad")} to="Grad" />
      <Btn label={t("btn_career")} to="Career" />
      <Btn label={t("btn_planner")} to="Planner" />
      <Btn label={t("btn_whatif")} to="WhatIf" />
      <Btn label={t("btn_badges")} to="Badges" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { marginTop: 6, fontSize: 28, fontWeight: "900" },
  btn: { borderWidth: 1, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnText: { fontWeight: "900" },
});
