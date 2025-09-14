import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
export default function AuthScreen() {
    const [isSignedUp, setSignedUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const { signIn, signUp } = useAuth();

    useEffect(() => {
        if (error) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setError(null));
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);


    const handleAuth = async () => {
        if (!email || !password) {
            setError(`Please enter all fields`);
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setError(null)

        if (isSignedUp) {
            const err = await signIn(email, password);
            if (err) {
                setError(err)
                return
            }
        } else {
            const err = await signUp(email, password);
            if (err) {
                setError(err)
                return
            }
        }
        router.replace("/")
    };

    const handleSwitchMode = () => {
        setSignedUp((prev) => !prev)
    }
    return <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.title} variant="headlineMedium">{isSignedUp ? "Welcome Back" : "Create Account"}</Text>
            {error && (
                <Animated.View style={[styles.errorBlock, { opacity: fadeAnim }]}>
                    <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
            )}


            <TextInput
                label="Email"
                // placeholder="john.doe@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
                onChangeText={setEmail}
            />

            <TextInput
                label="Password"
                autoCapitalize="none"
                secureTextEntry
                mode="outlined"
                style={styles.input}
                onChangeText={setPassword}
            />

            <Button
                mode="contained"
                style={styles.button}
                onPress={handleAuth}
            >
                {isSignedUp ? "Login" : "Register"}
            </Button>
            <Button
                mode="text"
                onPress={handleSwitchMode}
                style={styles.switchModeButton}
            >
                {isSignedUp ? "Sign up to get started" : "Already have an Account ? Sign In"}
            </Button>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    content: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
        justifyContent: "center"
    },
    title: {
        textAlign: "center",
        marginBottom: 24,
        fontWeight: 500,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8
    },
    switchModeButton: {
        marginTop: 16
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