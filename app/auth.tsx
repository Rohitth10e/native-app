import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";

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
      setError("Please enter all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(null);

    if (isSignedUp) {
      const err = await signIn(email, password);
      if (err) return setError(err);
    } else {
      const err = await signUp(email, password);
      if (err) return setError(err);
    }

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Surface style={styles.card}>
          <Text style={styles.title} variant="headlineMedium">
            {isSignedUp ? "Welcome Back" : "Create Account"}
          </Text>

          {error && (
            <Animated.View style={[styles.errorBlock, { opacity: fadeAnim }]}>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          <TextInput
            label="Email"
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
            onPress={() => setSignedUp(!isSignedUp)}
            style={styles.switchModeButton}
          >
            {isSignedUp ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
    color: "#22223b",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 6,
  },
  switchModeButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  errorBlock: {
    padding: 12,
    backgroundColor: "#FCA5A5",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#B91C1C",
    textAlign: "center",
    fontWeight: "500",
  },
});
