import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Text } from "react-native-paper";
export default function Index() {

  const {signOut, user} = useAuth()
  const [habits, setHabits] = useState<Habit[]>();

  const fetchHabits = async() =>{
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log(response.documents)
      setHabits(response.documents as Habit[]);
    } catch(err) {
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchHabits()
  },[user])

  return (
    <View
      style={styles.view}
    >
      <Text variant="headlineSmall">Today's Habits</Text>
      <Button mode="text" onPress={signOut} icon={"logout"}>Sign out</Button>

      {
      habits?.length===0? <Text style={styles.emptyStateText}> No habit's yet. Add your first Habit!</Text>:
      habits?.map((habit,key)=>(
        <View key={key} style={styles.cardContent}>
          <Text style={styles.cardTitle}>{habit.title}</Text>
          <Text style={styles.cardDesc}>{habit.description}</Text>
          <View style={styles.cardFooter}>
            <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} />
            <Text>{habit.streak_count} days streak</Text>
          </View>
          <View>
            <Text>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
          </View>
        </View>
      ))
      }

    </View>
  );
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBtn: {
    width: 100,
    height: 20,
    backgroundColor: "coral",
    textAlign: "center",
    borderRadius: 8,
  }
})