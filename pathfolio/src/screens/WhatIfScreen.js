// src/screens/WhatIfScreen.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Animated,
  Easing,
  Platform,
  UIManager,
} from "react-native";
import { useApp } from "../context/AppContext";
import T from "../components/T";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const parseNum = (v, def = 0) => {
  const x = parseFloat(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(x) ? x : def;
};


function scoreWhatIf({
  gpaU = 0, gpaW = 0, apCount = 0, ecLevel = 0, hoursWeek = 0,
  leadership = false, volunteer = 0, sat = 0, act = 0,
}) {
  const gpaNorm   = clamp(gpaU / 4.0, 0, 1);
  const gpaWNorm  = clamp(gpaW / 5.0, 0, 1);
  const rigor     = clamp(apCount / 10, 0, 1);
  const ec        = clamp((ecLevel * 0.5) + clamp(hoursWeek / 10, 0, 0.5), 0, 1);
  const lead      = leadership ? 1 : 0;
  const vol       = clamp(volunteer / 100, 0, 1);

  let test = 0;
  if (sat && sat >= 400) test = clamp((sat - 400) / 1200, 0, 1);
  else if (act && act >= 1) test = clamp((act - 10) / 26, 0, 1) * 0.95;

  const raw =
    (gpaNorm * 26) + (gpaWNorm * 10) + (rigor * 20) +
    (ec * 14) + (lead * 10) + (vol * 8) + (test * 18) + 8;

  return clamp(Math.round(raw), 0, 100);
}

function buildNextSteps(model, score) {
  const { gpaU, apCount, ecLevel, hoursWeek, leadership, volunteer, sat, act } = model;
  const steps = [];

  if (score >= 90) {
    steps.push("Sustain rigor (AP/IB/Honors) while protecting GPA.");
    steps.push("Deepen leadership with a project or mentoring others.");
    steps.push("Polish narrative: portfolio, competitions, or independent study.");
  } else if (score >= 75) {
    if (apCount < 6) steps.push("Add 1–2 advanced (AP/IB/Honors) courses aligned to strengths.");
    if (!leadership) steps.push("Pursue a leadership role in your strongest activity.");
    if ((sat || act) && score < 85) steps.push("Targeted test prep (4–6 weeks) to lift superscore.");
    steps.push("Show depth: commit weekly to one standout activity.");
  } else {
    if (gpaU < 3.2) steps.push("Focus on GPA growth: tutoring, office hours, study schedule.");
    if (ecLevel < 2) steps.push("Choose 1 primary club/sport and commit 3–5 hrs/week.");
    if (!leadership) steps.push("Coordinate a small initiative (drive, workshop, or event).");
    steps.push("Build momentum: finish 1 tangible project this month.");
  }

  if (!sat && !act) steps.push("Consider PSAT/SAT/ACT or a practice test to calibrate strategy.");
  if (volunteer < 50) steps.push("Aim for 2–3 hrs/week of consistent service in one place.");
  if (hoursWeek < 3 && ecLevel <= 1) steps.push("Add 2–3 hours weekly to your best-fit activity.");
  return steps;
}


const InputRow = React.memo(function InputRow({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  rightControl, 
  colorSet,
}) {
  const { text, subText, border } = colorSet;
  const onChange = useCallback((t) => onChangeText?.(t), [onChangeText]);

  return (
    <View style={[styles.row, { borderColor: border }]}>
      <T style={[styles.label, { color: text }]}>{label}</T>

      {rightControl ? (
        <View style={{ flex: 1, alignItems: "flex-end" }}>{rightControl}</View>
      ) : (
        <TextInput
          value={value ?? ""}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={subText}
          keyboardType={keyboardType}
          maxLength={maxLength}

          autoCorrect={false}
          autoCapitalize="none"
          blurOnSubmit={false}
          returnKeyType="done"
          style={[styles.input, { color: text, borderColor: border }]}
        />
      )}
    </View>
  );
});

const Toggle = React.memo(function Toggle({ value, onChange, colorSet }) {
  const { primary, border } = colorSet;
  const bg = value ? primary : border;
  return (
    <Pressable
      onPress={() => onChange?.(!value)}
      style={[
        styles.toggle,
        { backgroundColor: bg, borderColor: bg },
      ]}
    >
      <Animated.View
        style={[
          styles.knob,
          { transform: [{ translateX: value ? 18 : 0 }], backgroundColor: "#fff" },
        ]}
      />
    </Pressable>
  );
});


export default function WhatIfScreen() {
  const { theme, t } = useApp();
  const c = theme.colors;

  // Inputs
  const [gpaU, setGpaU]         = useState("");
  const [gpaW, setGpaW]         = useState("");
  const [apCount, setApCount]   = useState("");
  const [ecLevel, setEcLevel]   = useState("1"); 
  const [hoursWeek, setHours]   = useState("");
  const [leadership, setLead]   = useState(false);
  const [volunteer, setVol]     = useState("");
  const [sat, setSAT]           = useState("");
  const [act, setACT]           = useState("");

  // Simulate state
  const [simulated, setSimulated] = useState(false);


  const progressAnim = useRef(new Animated.Value(0)).current;
  const numberAnim   = useRef(new Animated.Value(0)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const cardScale    = useRef(new Animated.Value(0.96)).current;


  const model = useMemo(() => ({
    gpaU: clamp(parseNum(gpaU), 0, 4.0),
    gpaW: clamp(parseNum(gpaW), 0, 5.0),
    apCount: clamp(parseInt(apCount || "0", 10) || 0, 0, 20),
    ecLevel: clamp(parseInt(ecLevel || "0", 10) || 0, 0, 3),
    hoursWeek: clamp(parseNum(hoursWeek), 0, 40),
    leadership,
    volunteer: clamp(parseNum(volunteer), 0, 500),
    sat: clamp(parseNum(sat), 0, 1600),
    act: clamp(parseNum(act), 0, 36),
  }), [gpaU, gpaW, apCount, ecLevel, hoursWeek, leadership, volunteer, sat, act]);

  const finalScore = useMemo(() => scoreWhatIf(model), [model]);
  const steps      = useMemo(() => buildNextSteps(model, finalScore), [model, finalScore]);

  const handleSimulate = useCallback(() => {
    Keyboard.dismiss();
    setSimulated(true);

    progressAnim.setValue(0);
    numberAnim.setValue(0);
    cardOpacity.setValue(0);
    cardScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(progressAnim, { toValue: finalScore, duration: 900, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
      Animated.timing(numberAnim,   { toValue: finalScore, duration: 900, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
      Animated.timing(cardOpacity,  { toValue: 1,          duration: 300, useNativeDriver: true }),
      Animated.spring(cardScale,    { toValue: 1,          damping: 12,   stiffness: 120, useNativeDriver: true }),
    ]).start();
  }, [finalScore, progressAnim, numberAnim, cardOpacity, cardScale]);

  
  const barWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  const colors = useMemo(() => ({
    primary: c.primary, background: c.background, card: c.card, text: c.text, subText: c.subText, border: c.border
  }), [c.primary, c.background, c.card, c.text, c.subText, c.border]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
    >
      {}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <T style={[styles.title, { color: colors.primary }]}>{t("whatif_title")}</T>

        <InputRow
          label={t("gpa_u")}
          value={gpaU}
          onChangeText={setGpaU}
          placeholder="e.g., 3.6"
          keyboardType="decimal-pad"
          maxLength={4}
          colorSet={colors}
        />
        <InputRow
          label={t("gpa_w")}
          value={gpaW}
          onChangeText={setGpaW}
          placeholder="e.g., 4.3"
          keyboardType="decimal-pad"
          maxLength={4}
          colorSet={colors}
        />
        <InputRow
          label="AP/IB Count"
          value={apCount}
          onChangeText={setApCount}
          placeholder="e.g., 5"
          keyboardType="number-pad"
          maxLength={2}
          colorSet={colors}
        />
        <InputRow
          label="EC Level (0–3)"
          value={ecLevel}
          onChangeText={setEcLevel}
          placeholder="0 none, 3 exceptional"
          keyboardType="number-pad"
          maxLength={1}
          colorSet={colors}
        />
        <InputRow
          label="EC Hours / Week"
          value={hoursWeek}
          onChangeText={setHours}
          placeholder="e.g., 5"
          keyboardType="decimal-pad"
          maxLength={4}
          colorSet={colors}
        />
        <InputRow
          label="Leadership Role"
          value=""
          onChangeText={() => {}}
          rightControl={<Toggle value={leadership} onChange={setLead} colorSet={colors} />}
          colorSet={colors}
        />
        <InputRow
          label="Volunteer Hours / Yr"
          value={volunteer}
          onChangeText={setVol}
          placeholder="e.g., 60"
          keyboardType="decimal-pad"
          maxLength={4}
          colorSet={colors}
        />
        <InputRow
          label="SAT (optional)"
          value={sat}
          onChangeText={setSAT}
          placeholder="400–1600"
          keyboardType="number-pad"
          maxLength={4}
          colorSet={colors}
        />
        <InputRow
          label="ACT (optional)"
          value={act}
          onChangeText={setACT}
          placeholder="1–36"
          keyboardType="number-pad"
          maxLength={2}
          colorSet={colors}
        />

        <Pressable
          onPress={handleSimulate}
          style={[styles.btn, { backgroundColor: colors.primary }]}
          android_ripple={{ color: "#ffffff20" }}
        >
          <T style={styles.btnText}>Simulate</T>
        </Pressable>
      </View>

      {}
      {simulated && (
        <Animated.View style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: cardOpacity, transform: [{ scale: cardScale }] }
        ]}>
          <T style={[styles.title, { color: colors.primary }]}>Results</T>

          <View style={styles.scoreWrap}>
            <Animated.View style={[styles.scoreGlow, { opacity: cardOpacity }]} />
            <Animated.Text
              style={[
                styles.scoreBig,
                { color: finalScore >= 85 ? "#16c784" : finalScore >= 70 ? "#f6a821" : "#e44" },
              ]}
            >
              {finalScore}
            </Animated.Text>
            <T style={[styles.scoreSub, { color: colors.subText }]}>Overall Readiness</T>
          </View>

          <View style={[styles.barWrap, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  width: barWidth,
                  backgroundColor: finalScore >= 85 ? "#16c784" : finalScore >= 70 ? "#f6a821" : "#e44",
                },
              ]}
            />
          </View>
          <T style={[styles.scoreHint, { color: colors.subText }]}>{finalScore}% {t("score_out_of")} 100</T>

          <View style={{ height: 8 }} />
          <T style={[styles.sectionTitle, { color: colors.text }]}>Suggested Next Steps</T>
          <View style={{ marginTop: 6 }}>
            {steps.map((s, i) => (
              <View key={i} style={[styles.stepPill, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <T style={[styles.stepText, { color: colors.text }]} numberOfLines={3}>{s}</T>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 1,
  },
  title: { fontSize: 18, fontWeight: "900", letterSpacing: 0.2, marginBottom: 10 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderBottomWidth: 1, paddingVertical: 10,
  },
  label: { fontSize: 15, fontWeight: "700" },
  input: {
    minWidth: 110, borderWidth: 1, borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 10, fontSize: 16,
    textAlign: "right",
  },
  toggle: {
    width: 44, height: 24, borderRadius: 999, borderWidth: 1, padding: 2, justifyContent: "center",
  },
  knob: { width: 20, height: 20, borderRadius: 999 },

  btn: { marginTop: 14, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  scoreWrap: { alignItems: "center", justifyContent: "center", marginTop: 4, marginBottom: 6 },
  scoreGlow: {
    position: "absolute", width: 200, height: 200, borderRadius: 999, backgroundColor: "#16c78422",
    ...(Platform.OS === "web" ? { filter: "blur(20px)" } : null),
  },
  scoreBig: { fontSize: 56, fontWeight: "900" },
  scoreSub: { marginTop: -2, fontWeight: "700" },
  barWrap: { marginTop: 10, height: 18, borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 999 },
  scoreHint: { marginTop: 8, textAlign: "center", fontWeight: "600" },

  sectionTitle: { fontSize: 16, fontWeight: "900", marginTop: 8, marginBottom: 2 },
  stepPill: { borderRadius: 12, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8 },
  stepText: { fontSize: 15, fontWeight: "700" },
});
