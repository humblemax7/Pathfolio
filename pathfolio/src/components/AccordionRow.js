import React, { useRef, useState } from "react";
import { View, Pressable, Animated, Easing, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import T from "./T";

export default function AccordionRow({ label, description, inputEl }){
  const { theme } = useApp();
  const c = theme.colors;
  const [open, setOpen] = useState(false);
  const h = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;

  function toggle(){
    const to = open ? 0 : 1;
    setOpen(!open);
    Animated.parallel([
      // Height and opacity must stay on the JS driver (useNativeDriver:false)
      Animated.timing(h,  { toValue: to, duration: 220, useNativeDriver: false, easing: Easing.out(Easing.quad) }),
      Animated.timing(op, { toValue: to, duration: 220, useNativeDriver: false }),
      // Rotation uses transform, can use native driver safely — but to be extra safe/uniform, keep it false too
      Animated.timing(rot, { toValue: to, duration: 220, useNativeDriver: false }),
    ]).start();
  }

  const maxH  = h.interpolate({ inputRange:[0,1], outputRange:[0, 220] });
  const rotate = rot.interpolate({ inputRange:[0,1], outputRange:["0deg", "180deg"] });

  return (
    <View style={[styles.card, { borderColor:c.border, backgroundColor:"#fff" }]}>
      <Pressable onPress={toggle} style={styles.head} android_ripple={{ color:"#e8ecfa" }}>
        <T style={[styles.title, { color:c.text }]}>{label}</T>
        <Animated.View style={{ transform:[{ rotate }] }}>
          <Ionicons name="chevron-down" size={18} color="#687691" />
        </Animated.View>
      </Pressable>
      <Animated.View style={{ height:maxH, opacity:op, overflow:"hidden" }}>
        <View style={{ paddingHorizontal:12, paddingBottom:12, gap:8 }}>
          {!!description && <T style={{ color:c.subText }}>{description}</T>}
          {inputEl}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{ borderWidth:1, borderRadius:12, marginBottom:8 },
  head:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:12, paddingVertical:10 },
  title:{ fontWeight:"900" }
});
