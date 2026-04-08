// src/screens/GradScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
} from "react-native";

import { useApp } from "../context/AppContext";
import stateReqs from "../data/stateReqs";
import creditInfo from "../data/stateCreditInfo";
import { recommend, onTrackVerdict } from "../logic/recommendations";
import Select from "../components/Select";
import RingGauge from "../components/RingGauge";
import Pill from "../components/Pill";
import T from "../components/T";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SUBJECTS = [
  { key: "english", labelEn: "English", labelEs: "Inglés", icon: "📝" },
  { key: "math", labelEn: "Math", labelEs: "Matemáticas", icon: "➗" },
  { key: "science", labelEn: "Science", labelEs: "Ciencias", icon: "🔬" },
  { key: "social", labelEn: "Social Studies", labelEs: "Estudios Sociales", icon: "🌎" },
  { key: "arts", labelEn: "Arts / Electives", labelEs: "Artes / Optativas", icon: "🎨" },
  { key: "pe", labelEn: "PE / Health", labelEs: "Educ. Física / Salud", icon: "💪" },
];

export default function GradScreen() {
  const { theme, t, settings, profile, setProfile } = useApp();
  const c = theme.colors;

  const [stateCode, setStateCode] = useState(profile.state ?? null);

  // credit values
  const [vals, setVals] = useState({
    english: "",
    math: "",
    science: "",
    social: "",
    arts: "",
    pe: "",
  });

  // Dropdowns
  const [openKey, setOpenKey] = useState(null);

  // results reveal + animations
  const [revealed, setRevealed] = useState(false);
  const fadeResults = useRef(new Animated.Value(0)).current;
  const popResults = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (!revealed) {
      fadeResults.setValue(0);
      popResults.setValue(0.92);
    } else {
      Animated.parallel([
        Animated.timing(fadeResults, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(popResults, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [revealed]);

  // calc requirements per state
  const req = useMemo(() => (stateCode ? stateReqs[stateCode] : null), [stateCode]);

  
  const parsed = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(vals).map(([k, v]) => [k, Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0])
      ),
    [vals]
  );

  const partsTotal = useMemo(
    () => ["english", "math", "science", "social", "arts"].map((k) => (req ? req[k] || 0 : 0)).reduce((a, b) => a + b, 0),
    [req]
  );

  const requiredTotal = useMemo(() => {
    if (!req) return 0;
    // use state total
    return req.total ?? partsTotal;
  }, [req, partsTotal]);

  const earned = parsed.english + parsed.math + parsed.science + parsed.social + parsed.arts + parsed.pe;
  const pct = requiredTotal ? Math.min(100, (earned / requiredTotal) * 100) : 0;

  const remain = useMemo(() => {
    if (!req) return [];
    return ["english", "math", "science", "social", "arts"].map((k) => {
      const r = req[k];
      if (r == null) return { key: k, v: null };
      const need = Math.max(0, +(r - parsed[k]).toFixed(2));
      return { key: k, v: need };
    });
  }, [req, parsed]);

  const verdict = useMemo(() => onTrackVerdict({ requiredTotal, earned }), [requiredTotal, earned]);

  // smart suggestions for classes
  const classSuggestions = useMemo(() => {
    if (!stateCode) return [];
    const r = recommend({ stateReq: req, credits: parsed });
    return r.courses || [];
  }, [stateCode, req, parsed]);

  // description
  const getDesc = (key) => {
    const info = creditInfo?.[stateCode]?.[key];
    const label = subjLabel(key);
    const need = req?.[key];
    const needStr = Number.isFinite(need) ? `${need} ${settings.language === "es" ? "crédito(s)" : "credit(s)"}` : "LD";
    if (info) {
      
      return `${stateCode} ${settings.language === "es" ? "requiere" : "requires"} ${needStr} ${settings.language === "es" ? "en" : "in"} ${label}. ${info}`;
    }
    
    return `${stateCode} ${settings.language === "es" ? "requiere" : "requires"} ${needStr} ${settings.language === "es" ? "en" : "in"} ${label}.`;
  };

  const subjLabel = (key) => {
    const meta = SUBJECTS.find((s) => s.key === key);
    if (!meta) return key;
    return settings.language === "es" ? meta.labelEs : meta.labelEn;
  };

  // states dropdown
  const stateOptions = useMemo(
    () => Object.keys(stateReqs).map((s) => ({ label: s, value: s })),
    []
  );

  // dropdown animation
  const toggleOpen = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenKey((k) => (k === key ? null : key));
  };

  // Results page
  const scrollerRef = useRef(null);
  const resultsYRef = useRef(0);
  const doCalculate = () => {
    setRevealed(true);
    setProfile((p) => ({ ...p, credits: vals, state: stateCode }));
    
    setTimeout(() => {
      if (scrollerRef.current && resultsYRef.current > 0) {
        scrollerRef.current.scrollTo({ y: Math.max(0, resultsYRef.current - 16), animated: true });
      }
    }, 75);
  };

  
  const placeholderFor = (key) => {
    const r = req?.[key];
    return Number.isFinite(r) ? String(r.toFixed(1).replace(/\.0$/, "")) : "0";
    
  };

  const ringColor = pct < 50 ? "#e44" : pct < 80 ? "#f6a821" : c.primary;

  return (
    <ScrollView ref={scrollerRef} contentContainerStyle={[styles.container, { backgroundColor: c.background }]}>
      {/* 1) State selection */}
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <T style={[styles.heading, { color: c.primary }]}>{t("grad_choose_state")}</T>
        <Select
          label={t("state_label")}
          value={stateCode}
          onChange={(v) => {
            setStateCode(v);
            setProfile((p) => ({ ...p, state: v }));
            setOpenKey(null);
            setRevealed(false);
          }}
          options={stateOptions}
          placeholder={t("state_label")}
        />
      </View>

      {}
      {stateCode && (
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <T style={[styles.heading, { color: c.primary }]}>{t("grad_enter_credits")}</T>

          {SUBJECTS.map(({ key, icon }) => (
            <View key={key} style={[styles.accWrap, { borderColor: c.border, backgroundColor: c.background }]}>
              <Pressable onPress={() => toggleOpen(key)} style={styles.accHeader}>
                <T style={[styles.accTitle, { color: c.text }]} speakText={`${subjLabel(key)}`}>
                  {icon} {subjLabel(key)}
                </T>
                <T style={[styles.reqNum, { color: c.subText }]}>
                  {Number.isFinite(req?.[key]) ? req[key] : "LD"}
                </T>
              </Pressable>

              {openKey === key && (
                <Animated.View style={{ opacity: 1, transform: [{ translateY: 0 }] }}>
                  <T style={[styles.desc, { color: c.subText }]} speakText={getDesc(key)}>
                    {getDesc(key)}
                  </T>
                  <TextInput
                    keyboardType="decimal-pad"
                    value={vals[key]}
                    placeholder={placeholderFor(key)}
                    onChangeText={(tval) => setVals((v) => ({ ...v, [key]: tval }))}
                    style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.card }]}
                  />
                </Animated.View>
              )}
            </View>
          ))}

          <Pressable onPress={doCalculate} style={[styles.btn, { backgroundColor: c.primary }]}>
            <T style={styles.btnText}>{t("calculate")}</T>
          </Pressable>
        </View>
      )}

      {/* Results*/}
      {stateCode && revealed && (
        <Animated.View
          onLayout={(e) => {
            resultsYRef.current = e.nativeEvent.layout.y;
          }}
          style={[
            styles.card,
            {
              backgroundColor: c.card,
              borderColor: c.border,
              opacity: fadeResults,
              transform: [{ scale: popResults }],
            },
          ]}
        >
          <T style={[styles.heading, { color: c.primary }]}>{t("requirement_status")}</T>

          {/* Big fancy ring */}
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 6 }}>
            <RingGauge value={pct} size={208} stroke={18} barColor={ringColor} trackColor={c.border} />
            <View style={{ position: "absolute", alignItems: "center" }}>
              <T style={{ fontSize: 36, fontWeight: "900", color: ringColor }}>{pct.toFixed(1)}%</T>
              <T style={{ fontWeight: "900" }}>
                {earned.toFixed(2)} / {requiredTotal || "—"}
              </T>
              <T style={{ color: c.subText }}>{verdict.verdict}</T>
            </View>
          </View>

          {/* */}
          <View style={{ marginTop: 14 }}>
            {remain.map(({ key, v }) => {
              const label = key === "social" ? "Social Studies" : key.charAt(0).toUpperCase() + key.slice(1);
              if (v === null) return <Pill key={key} type="warn" text={`${label}: LD (check district)`} />;
              if (v === 0) return <Pill key={key} type="ok" text={`${label}: Done`} />;
              return <Pill key={key} type="bad" text={`${label}: ${v} credit(s) needed`} />;
            })}
          </View>

          {/* suggestions */}
          {!!classSuggestions.length && (
            <>
              <View style={{ height: 10 }} />
              <T style={[styles.sub, { color: c.text }]}>{t("suggestions")}</T>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {classSuggestions.map((name, i) => (
                  <Pill key={i} text={name} />
                ))}
              </View>
            </>
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },

  heading: { fontSize: 16, fontWeight: "900", marginBottom: 8 },
  sub: { fontSize: 15, fontWeight: "900", marginTop: 8 },

  accWrap: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  accHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accTitle: { fontSize: 15, fontWeight: "900" },
  reqNum: { fontSize: 14, fontWeight: "900", opacity: 0.8 },

  desc: { marginTop: 8, marginBottom: 8, lineHeight: 20 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minWidth: 120,
    textAlign: "right",
    fontWeight: "900",
  },

  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
