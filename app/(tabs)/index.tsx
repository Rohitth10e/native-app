import { useAuth } from "@/lib/auth-context";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
export default function Index() {

  const {signOut} = useAuth()
  return (
    <View
      style={styles.view}
    >
      <Text>Hello there</Text>
      <Button mode="text" onPress={signOut}>Sign out</Button>
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
    padding:"2px 5px",
    backgroundColor: "coral",
    textAlign: "center",
    borderRadius: 8,
  }
})