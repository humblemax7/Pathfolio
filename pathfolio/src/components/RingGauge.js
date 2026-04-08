// src/components/RingGauge.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const A = Animated;
const AnimatedCircle = A.createAnimatedComponent(Circle);


export default function RingGauge({
  value = 0,
  size = 156,
  stroke = 14,
  trackColor = "#e6ecfb",
  barColor = "#184aa6",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new A.Value(0)).current;

  useEffect(() => {
    A.timing(progress, { toValue: Math.max(0, Math.min(100, value)), duration: 700, useNativeDriver: true }).start();
  }, [value]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={trackColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          stroke={barColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </Svg>
      {/* glow shadow */}
      <View style={[styles.glow, { shadowColor: barColor }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "84%",
    height: "84%",
    borderRadius: 999,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
});
