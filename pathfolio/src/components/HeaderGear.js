import React, { useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HeaderGear(){
  const nav = useNavigation();
  const a = useRef(new Animated.Value(0)).current;

  const onIn = ()=> Platform.OS==="web" && Animated.timing(a,{toValue:1,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:false}).start();
  const onOut= ()=> Platform.OS==="web" && Animated.timing(a,{toValue:0,duration:220,easing:Easing.in(Easing.quad),useNativeDriver:false}).start();

  const w = a.interpolate({ inputRange:[0,1], outputRange:[0, 200] });
  const op= a.interpolate({ inputRange:[0,1], outputRange:[0, 1] });

  return (
    <Pressable onPress={()=>nav.navigate("Settings")} onHoverIn={onIn} onHoverOut={onOut}
      style={styles.wrap} accessibilityRole="button" accessibilityLabel="Settings and accessibility">
      <Ionicons name="settings-sharp" size={22} color="#1d2636" />
      {Platform.OS==="web" && (
        <Animated.View style={[styles.labelBox,{ width:w, opacity:op }]}>
          <Text style={styles.label}>Settings & Accessibility</Text>
        </Animated.View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  wrap:{ flexDirection:"row", alignItems:"center", gap:8, paddingHorizontal:8, paddingVertical:4, borderRadius:10 },
  labelBox:{ overflow:"hidden" },
  label:{ color:"#1d2636", fontWeight:"700" }
});
