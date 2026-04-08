// src/screens/CareerScreen.js
import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Modal, Pressable, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { useApp } from "../context/AppContext";
import T from "../components/T";
import Select from "../components/Select";
import Pill from "../components/Pill";
import careers from "../data/careers";

const TESTING_INFO = [
  "SAT: Aug/Oct/Nov/Dec/Mar/May/Jun.",
  "ACT: Sep/Oct/Dec/Feb/Apr/Jun/Jul.",
  "PSAT: October — National Merit index.",
  "AP Exams: first two weeks of May.",
];

function usePressScale() {
  const s = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(s, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(s, { toValue: 1, useNativeDriver: true }).start();
  return { scaleStyle: { transform: [{ scale: s }] }, onPressIn, onPressOut };
}

export default function CareerScreen() {
  const { theme, t, settings, setSettings } = useApp();
  const c = theme.colors;

  const [sel, setSel] = useState(null);
  const [learnOpen, setLearnOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(!!settings.showCareerIntro);

  const { scaleStyle, onPressIn, onPressOut } = usePressScale();

  const options = useMemo(() => Object.keys(careers).map(k => ({ label: k, value: k })), []);
  const current = sel ? careers[sel] : null;

  const closeIntro = (dontShow) => {
    setShowIntro(false);
    if (dontShow) setSettings(s => ({ ...s, showCareerIntro: false }));
  };

  return (
    <>
      <Modal transparent visible={showIntro} animationType="fade" onRequestClose={() => closeIntro(false)}>
        <View style={styles.modalWrap}>
          <View style={[styles.modalCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <T style={[styles.modalTitle, { color: c.primary }]}>{t("career_intro_title")}</T>
            <T style={{ color: c.text, marginTop: 6 }}>{t("career_intro_body")}</T>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <Pressable onPress={() => closeIntro(false)} style={[styles.btn, { backgroundColor: c.primary }]}>
                <T style={{ color: "#fff", fontWeight: "900" }}>{t("career_intro_ready")}</T>
              </Pressable>
              <Pressable onPress={() => closeIntro(true)} style={[styles.btnGhost, { borderColor: c.border }]}>
                <T style={{ fontWeight: "900" }}>{t("career_intro_dont")}</T>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: c.background }]}>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <T style={[styles.heading, { color: c.primary }]}>{t("choose_career")}</T>
          <Select value={sel} onChange={setSel} options={options} placeholder="Select a path…" />

          <Animated.View style={[scaleStyle, { marginTop: 10 }]}>
            <Pressable
              onPress={() => { setLearnOpen(v => !v); Haptics.selectionAsync().catch(()=>{}); }}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={[styles.learnBtn, { backgroundColor: learnOpen ? c.primary : c.card, borderColor: c.border }]}
            >
              <T style={{ color: learnOpen ? "#fff" : c.text, fontWeight: "900" }}>{t("learn_more")}</T>
            </Pressable>
          </Animated.View>

          {learnOpen && (
            <View style={{ marginTop: 12, gap: 10 }}>
              {Object.entries(careers).map(([k, v]) => (
                <View key={k} style={[styles.learnRow, { backgroundColor: c.card, borderColor: c.border }]}>
                  <T style={{ fontWeight: "900", color: c.text }}>{k}</T>
                  {!!v.about && <T style={{ color: c.subText, marginTop: 4 }}>{v.about}</T>}
                </View>
              ))}
              <View style={[styles.learnRow, { backgroundColor: c.card, borderColor: c.border }]}>
                <T style={{ fontWeight: "900", color: c.text }}>{t("testing_deadlines")}</T>
                {TESTING_INFO.map((line, i) => (<T key={i} style={{ color: c.subText, marginTop: 4 }}>• {line}</T>))}
                <T style={{ color: c.subText, marginTop: 6 }}>{t("confirm_dates")}</T>
              </View>
            </View>
          )}
        </View>

        {current && (
          <>
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <T style={[styles.sub, { color: c.text }]}>{t("rec_classes")}</T>
              <View style={styles.wrap}>{current.classes.map((name, i) => <Pill key={`c-${i}`} text={name} />)}</View>
            </View>
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <T style={[styles.sub, { color: c.text }]}>{t("rec_clubs")}</T>
              <View style={styles.wrap}>{current.clubs.map((name, i) => <Pill key={`cl-${i}`} text={name} />)}</View>
            </View>
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <T style={[styles.sub, { color: c.text }]}>{t("rec_comps")}</T>
              <View style={styles.wrap}>{current.comps.map((name, i) => <Pill key={`co-${i}`} text={name} />)}</View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: "900", marginBottom: 8 },
  sub: { fontSize: 15, fontWeight: "900", marginBottom: 6 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  learnBtn: { borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  learnRow: { borderWidth: 1, borderRadius: 12, padding: 12 },

  
  modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 20 },
  modalCard: { borderWidth: 1, borderRadius: 16, padding: 16, maxWidth: 600, width: "100%" },
  modalTitle: { fontSize: 18, fontWeight: "900" },
  btn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 },
  btnGhost: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1 },
});
