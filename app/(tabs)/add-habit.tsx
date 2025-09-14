import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from "react-native";
import { ID } from 'react-native-appwrite';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
const FREQUENCIES = ["daily", "weekly", "monthly"]

export default function AddHabitScreen() {
    type Frequency = (typeof FREQUENCIES)[number];
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<string>("daily");
    const [error, setError] = useState<string | null>("");

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!user) return;

        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(), {
                user_id: user.$id,
                title,
                description,
                frequency,
                streak_count: 0,
                last_completed: new Date().toISOString(),
            });
            setDescription("")
            setTitle("")

            router.back()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
            return;
        }

    }

    return (
        <View style={styles.container}>
            {error && (
                <Animated.View style={[styles.errorBlock, { opacity: fadeAnim }]}>
                    <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
            )}
            <TextInput label="Title" mode="outlined" style={styles.input} onChangeText={setTitle} />
            <TextInput label="Description" mode="outlined" style={styles.input} onChangeText={setDescription} />
            <View style={styles.frequencyContainer}>
                <SegmentedButtons
                    value={frequency}
                    onValueChange={(value) => { setFrequency(value as Frequency) }}
                    buttons={FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: freq.charAt(0).toUpperCase() + freq.slice(1),
                    }))} style={styles.segmentedButtons} />
            </View>
            <Button mode='contained' style={styles.button} disabled={!title || !description} onPress={handleSubmit}>
                Add Habit
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
        justifyContent: 'center'
    },
    input: {
        marginBottom: 16,
    },

    frequencyContainer: {
        marginBottom: 24,
    },

    SegmentedButtons: {
        marginBottom: 16
    },

    button: {
    },

    errorBlock: {
        padding: 16,
        backgroundColor: "#FCA5A5", // Tailwind red-300 for softer background
        borderColor: "#EF4444",     // Tailwind red-500 for contrast
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
    },
    errorText: {
        color: "#B91C1C", // Tailwind red-700 for strong readability
        textAlign: "center",
        fontWeight: "500",
    }
})