import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{
        headerStyle: { backgroundColor: "#f5f5f5" }, headerShadowVisible: false, tabBarStyle: {
          backgroundColor: "#f5f5f5",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#666666",
        tabBarLabelStyle: {
          textAlign: "center",
          fontSize: 12,
          fontWeight: "600",
        },
      }}>
        <Tabs.Screen name="index" options={{
          title: "Today's Habits", tabBarIcon: ({ color, focused }) => (
            <Ionicons name="today-outline" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="streaks" options={{
          title: "Streaks", tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="chart-line" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="add-habit" options={{
          title: "Add Habit", tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="plus-circle" size={24} color={color} />
          )
        }} />
      </Tabs>
    </>
  );
}
