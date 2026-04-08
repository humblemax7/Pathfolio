import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import T from "./T";

export default function Select({ label, value, onChange, options, placeholder = "Select…", disabled }) {
  const { theme } = useApp();
  const c = theme.colors;
  const [open, setOpen] = useState(false);

  const picked = options?.find(o => o.value === value);

  return (
    <View style={{ marginBottom: 10 }}>
      {!!label && <T style={[styles.label, { color: c.text }]}>{label}</T>}

      <Pressable
        onPress={() => setOpen(v => !v)}
        disabled={disabled}
        style={[
          styles.inputBtn,
          { backgroundColor: c.card, borderColor: c.border, opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <T style={[styles.value, { color: picked ? c.text : c.subText }]} numberOfLines={1}>
          {picked ? picked.label : placeholder}
        </T>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={c.text} />
      </Pressable>

      {open && (
        <View style={[styles.dropdown, { backgroundColor: c.card, borderColor: c.border }]}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 6 }}>
            {options?.map((o, i) => (
              <Pressable
                key={o.value ?? i}
                onPress={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: pressed ? "#eef2ff" : c.card,
                    borderBottomColor: c.border,
                    borderBottomWidth: i === options.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <T style={{ fontWeight: "800" }}>{o.label}</T>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: "900" },
  inputBtn: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: { fontWeight: "800", flex: 1, marginRight: 8 },
  dropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 260,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: { paddingVertical: 12, paddingHorizontal: 12 },
});
