import { StyleSheet, Text, View } from "react-native";
export default function Index() {
  return (
    <View
      style={styles.view}
    >
      <Text>Hello there</Text>
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