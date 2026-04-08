import React from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HeaderLogo(){
  const nav = useNavigation();
  return (
    <View style={styles.bar} accessibilityRole="header">
      <Pressable onPress={()=>nav.navigate("Home")} style={styles.touch} accessibilityLabel="Go to Home">
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  bar:{ alignItems:"center", paddingTop:8, paddingBottom:6 },
  touch:{ borderRadius:999, overflow:"hidden" },
  logo:{ width:56, height:56, borderRadius:16 }
});
