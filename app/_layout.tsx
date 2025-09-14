import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments()
  const router = useRouter()
  const navState = useRootNavigationState()

  useEffect(() => {
    if (!navState?.key) return
    const inAuthGroup = segments[0] === "auth"
    if (!user && !inAuthGroup && !isLoadingUser) {
      setTimeout(() => {
        router.replace("/auth");
      });
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/")
    }
  }, [navState, user, segments]);

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <PaperProvider theme={MD3LightTheme}>
          <SafeAreaProvider>
            <RouteGaurd>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </RouteGaurd>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </>
  );
}
