import React, { useMemo, useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useApp } from "../context/AppContext";
import T from "../components/T";
import Select from "../components/Select";
import stateReqs from "../data/stateReqs";

export default function SettingsScreen() {
  const { theme, t, settings, setSettings, profile, setProfile } = useApp();
  const c = theme.colors;

 
  const [nameLocal, setNameLocal] = useState(profile.name || "");
  const [stateLocal, setStateLocal] = useState(profile.state || "");
  const [ttsLocal, setTtsLocal] = useState(!!settings.ttsEnabled);
  const [hcLocal, setHcLocal] = useState(!!settings.highContrast);
  const [hcModeLocal, setHcModeLocal] = useState(settings.highContrastMode || "light");

  const stateOptions = useMemo(
    () => Object.keys(stateReqs).map(s => ({ label: s, value: s })),
    []
  );

  const save = () => {
    setProfile(p => ({ ...p, name: nameLocal.trim(), state: stateLocal || null }));
    setSettings(s => ({ ...s, ttsEnabled: ttsLocal, highContrast: hcLocal, highContrastMode: hcModeLocal }));
    Alert.alert(t("saved_toast"));
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: c.card, borderColor: c.border, color: c.text },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <T style={[styles.heading, { color: c.primary }]}>{t("settings_title")}</T>

        <T style={styles.section}>{t("profile_title")}</T>
        <T style={styles.label}>{t("your_name")}</T>
        <TextInput
          value={nameLocal}
          onChangeText={setNameLocal}
          placeholder="Jane Doe"
          placeholderTextColor={c.subText}
          style={inputStyle}
          autoCapitalize="words"
        />

        <Select
          label={t("default_state")}
          value={stateLocal}
          onChange={setStateLocal}
          options={stateOptions}
          placeholder={t("state_label")}
        />

        <T style={styles.section}>{t("tts_label")}</T>
        <View style={styles.row}>
          <Pressable
            onPress={() => setTtsLocal(true)}
            style={[styles.toggle, { backgroundColor: ttsLocal ? c.primary : c.card, borderColor: c.border }]}
          >
            <T style={{ color: ttsLocal ? "#fff" : c.text }}>On</T>
          </Pressable>
          <Pressable
            onPress={() => setTtsLocal(false)}
            style={[styles.toggle, { backgroundColor: !ttsLocal ? c.primary : c.card, borderColor: c.border }]}
          >
            <T style={{ color: !ttsLocal ? "#fff" : c.text }}>Off</T>
          </Pressable>
        </View>

        <T style={styles.section}>{t("hc_label")}</T>
        <View style={styles.row}>
          <Pressable
            onPress={() => setHcLocal(true)}
            style={[styles.toggle, { backgroundColor: hcLocal ? c.primary : c.card, borderColor: c.border }]}
          >
            <T style={{ color: hcLocal ? "#fff" : c.text }}>On</T>
          </Pressable>
          <Pressable
            onPress={() => setHcLocal(false)}
            style={[styles.toggle, { backgroundColor: !hcLocal ? c.primary : c.card, borderColor: c.border }]}
          >
            <T style={{ color: !hcLocal ? "#fff" : c.text }}>Off</T>
          </Pressable>
        </View>

        {hcLocal && (
          <>
            <T style={styles.section}>{t("hc_mode")}</T>
            <View style={styles.row}>
              <Pressable
                onPress={() => setHcModeLocal("light")}
                style={[styles.toggle, { backgroundColor: hcModeLocal === "light" ? c.primary : c.card, borderColor: c.border }]}
              >
                <T style={{ color: hcModeLocal === "light" ? "#fff" : c.text }}>{t("hc_light")}</T>
              </Pressable>
              <Pressable
                onPress={() => setHcModeLocal("dark")}
                style={[styles.toggle, { backgroundColor: hcModeLocal === "dark" ? c.primary : c.card, borderColor: c.border }]}
              >
                <T style={{ color: hcModeLocal === "dark" ? "#fff" : c.text }}>{t("hc_dark")}</T>
              </Pressable>
            </View>
          </>
        )}

        <Pressable onPress={save} style={[styles.saveBtn, { backgroundColor: c.primary }]}>
          <T style={{ color: "#fff", fontWeight: "900" }}>{t("save")}</T>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  heading: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  section: { marginTop: 12, fontWeight: "900" },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "800" },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  row: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 2 },
  toggle: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },
  saveBtn: { marginTop: 16, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
});
