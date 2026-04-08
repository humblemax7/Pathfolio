import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider, useApp } from "./src/context/AppContext";

import HomeScreen from "./src/screens/HomeScreen";
import GradScreen from "./src/screens/GradScreen";
import CareerScreen from "./src/screens/CareerScreen";
import PlannerScreen from "./src/screens/PlannerScreen";
import WhatIfScreen from "./src/screens/WhatIfScreen";
import AchievementsScreen from "./src/screens/AchievementsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HeaderGear from "./src/components/HeaderGear";

const Stack = createNativeStackNavigator();

function AppShell(){
  const { theme } = useApp();
  const Themed = { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...theme.colors } };
  return (
    <NavigationContainer theme={Themed}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign:"center",
          headerRight: ()=> <HeaderGear />
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title:"Pathfolio" }} />
        <Stack.Screen name="Grad" component={GradScreen} options={{ title:"Graduation Tracker" }} />
        <Stack.Screen name="Career" component={CareerScreen} options={{ title:"Career Paths" }} />
        <Stack.Screen name="Planner" component={PlannerScreen} options={{ title:"Planner" }} />
        <Stack.Screen name="WhatIf" component={WhatIfScreen} options={{ title:"What-If" }} />
        <Stack.Screen name="Badges" component={AchievementsScreen} options={{ title:"Badges" }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title:"Settings" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App(){
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
