import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return(
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor:"coral", headerStyle:{backgroundColor:"#f5f5f5"}, headerShadowVisible: false, tabBarStyle:{
        backgroundColor:"#f5f5f5",
        borderTopWidth:0,
        elevation:0,
        shadowOpacity:0
      }}}>
        <Tabs.Screen name="index" options={{title: "Home", tabBarIcon: ({color, focused})=> (
          <Feather name="home" size={24} color={color} />
        )}} />
        <Tabs.Screen name="login" options={{title: "Login", tabBarIcon: ({color, focused})=>(
          <AntDesign name="login" size={24} color={color} />
        )}} />
      </Tabs>
    </>
  );
}
