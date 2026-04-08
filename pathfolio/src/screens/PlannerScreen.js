import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { useApp } from "../context/AppContext";
import T from "../components/T";
import ProgressBar from "../components/ProgressBar";
import Pill from "../components/Pill";

export default function PlannerScreen() {
  const { theme, t } = useApp();
  const c = theme.colors;

  const [items, setItems] = useState([
    { id: "1", title: "Finish Personal Statement", due: "Sep 30", done: false },
    { id: "2", title: "Request 2 Letters of Rec", due: "Oct 15", done: false },
    { id: "3", title: "Register for SAT/ACT", due: "Aug 20", done: false },
  ]);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const completed = items.filter(i => i.done).length;
  const pct = items.length ? (completed / items.length) * 100 : 0;

  const inputStyle = [styles.input, { borderColor: c.border, backgroundColor: c.card, color: c.text }];

  const add = () => {
    if (!title.trim()) return;
    setItems(prev => [...prev, { id: String(Date.now()), title: title.trim(), due: due.trim(), done: false }]);
    setTitle(""); setDue("");
  };
  const toggle = id => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const remove = id => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <T style={[styles.heading, { color: c.primary }]}>{t("planner_title")}</T>

        <ProgressBar value={pct} height={12} />
        <T style={{ color: c.subText, marginTop: 4 }}>{`${Math.round(pct)}% ${t("percent_complete")}`}</T>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="New milestone (e.g., Submit FAFSA)"
            placeholderTextColor={c.subText}
            style={[...inputStyle, { flex: 1 }]}
          />
          <TextInput
            value={due}
            onChangeText={setDue}
            placeholder={`${t("due_label").toLowerCase()} (e.g., Oct 1)`}
            placeholderTextColor={c.subText}
            style={[...inputStyle, { width: 160 }]}
          />
        </View>

        <Pressable onPress={add} style={[styles.addBtn, { backgroundColor: c.primary }]} android_ripple={{ color: "#d8e2ff" }}>
          <T style={{ color: "#fff", fontWeight: "900" }}>{t("add_milestone")}</T>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <T style={[styles.sub, { color: c.text }]}>{t("timeline_title")}</T>

        {items.map(i => (
          <View key={i.id} style={[styles.itemRow, { borderColor: c.border }]}>
            <Pressable onPress={() => toggle(i.id)} style={[styles.checkbox, { borderColor: c.border, backgroundColor: i.done ? "#c7f0c7" : c.card }]} />
            <View style={{ flex: 1 }}>
              <T style={[styles.itemTitle, { textDecorationLine: i.done ? "line-through" : "none" }]}>{i.title}</T>
              {!!i.due && <T style={{ color: c.subText }}>{`${t("due_label")} ${i.due}`}</T>}
              <View style={{ marginTop: 6 }}><Pill text={i.done ? t("calculate")  : t("in_progress")} type={i.done ? "ok" : "neutral"} /></View>
            </View>
            <Pressable onPress={() => remove(i.id)} style={[styles.xBtn, { borderColor: c.border }]}><T style={{ fontWeight: "900" }}>×</T></Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: "900", marginBottom: 8 },
  sub: { fontSize: 15, fontWeight: "900", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10 },
  addBtn: { marginTop: 10, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  itemRow: { flexDirection: "row", gap: 10, paddingVertical: 10, borderTopWidth: 1, alignItems: "center" },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderRadius: 4 },
  xBtn: { width: 30, height: 30, borderWidth: 1, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemTitle: { fontWeight: "900" },
});
