import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";

export default function ProgressBar({ value = 0, height = 18 }) {
  const { theme } = useApp();
  const c = theme.colors;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 500, useNativeDriver: false }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View style={[styles.wrap, { height, backgroundColor: c.border }]}>
      <Animated.View style={[styles.fill, { width, backgroundColor: c.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
});
