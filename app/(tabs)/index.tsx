import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
export default function Index() {

  const { signOut, user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      // console.log(response.documents)
      setHabits(response.documents as Habit[]);
    } catch (err) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user) {
      const subscription = client.subscribe(
        `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`,
        (response: RealTimeResponse) => {
          if (response.events.some(e => e.endsWith('.create'))) {
            fetchHabits();
          } else if (response.events.some(e => e.endsWith('.update'))) {
            fetchHabits();
          } else if (response.events.some(e => e.endsWith('.delete'))) {
            fetchHabits();
          }
        }
      );

      fetchHabits();

      return () => {
        subscription(); // unsubscribe
      };
    }
  }, [user]);

  const renderRightActions = () => (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  )

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  )

  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleCompleteHabit = async (id: string) => {
    try {
      if (!user) return;

      await databases.createDocument(DATABASE_ID, "habit_completions", ID.unique(), {
        habit_id: id, user_id: user?.$id, completed_at: new Date().toISOString(),
      });
      const habit = habits?.find((h) => h.$id === id);

      if (!habit) return

      const today = new Date().toDateString();
      const lastCompleted = habit.last_completed ? new Date(habit.last_completed).toDateString()
        : null;
      let newStreak = habit.streak_count;

      if (lastCompleted === today && habit.streak_count > 0) {
        // Already completed today → don’t increment
        return;
      } else if (
        lastCompleted === new Date(Date.now() - 86400000).toDateString()
      ) {
        // Completed yesterday → continue streak
        newStreak += 1;
      } else {
        // Missed a day → reset streak
        newStreak = 1;
      }


      const updated = await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: newStreak, last_completed: new Date().toISOString()
      })
      console.log("Updated habit:", updated);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View
      style={styles.container}
    >
      <View style={styles.pageHead}>
        <Text variant="headlineSmall" style={styles.pageHeading}>Today's Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>Sign out</Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {
          habits?.length === 0 ? <Text style={styles.emptyStateText}> No habit's yet. Add your first Habit!</Text> :
            habits?.map((habit, key) => (
              <Swipeable ref={(ref) => (
                swipeableRefs.current[habit.$id] = ref
              )}
                key={key}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                  if (direction == "left") {
                    handleDeleteHabit(habit.$id);
                  } else if (direction == "right") {
                    handleCompleteHabit(habit.$id);
                  }

                  swipeableRefs.current[habit.$id]?.close();
                }}
              >
                <Surface style={styles.card} elevation={0}>
                  <View key={key} style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{habit.title}</Text>
                    <Text style={styles.cardDesc}>{habit.description}</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.streakBadge}>
                        <MaterialCommunityIcons
                          name="fire"
                          size={18}
                          color={"#ff9800"}
                        />
                        <Text style={styles.streakText}>
                          {habit.streak_count} day streak
                        </Text>
                      </View>
                      <View style={styles.frequencyBadge}>
                        <Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
                      </View>
                    </View>
                  </View>
                </Surface>
              </Swipeable>
            ))
        }
      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  pageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  pageHeading: {
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  title: {
    fontWeight: "bold"
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    // color: "#2223b"
  },
  cardDesc: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyStateText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#6666"
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16
  }
})