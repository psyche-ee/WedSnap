import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dashboard = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require("../assets/logo.png")} />
        <Text style={styles.title}>WedSnap</Text>
      </View>
      <Text style={styles.description}>
        Capture and share wedding {"\n"} memories together.
      </Text>
      <View style={styles.bannerContainer}>
        <Image source={require("../assets/wedsnap-banner.png")} />
      </View>
      <View style={styles.buttonContainer}>
        <Link href="/join" asChild>
          <Pressable style={styles.joinBtn}>
            <Image source={require("../assets/join.png")} />
            <Text style={styles.linkText}>Join a {"\n"}Wedding</Text>
          </Pressable>
        </Link>
        <Link href="/create" asChild>
          <Pressable style={styles.createBtn}>
            <Image source={require("../assets/create.png")} />
            <Text style={styles.linkText}>Create a {"\n"}Wedding</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4DFFD",
  },
  titleContainer: {
    flexDirection: "row",
    marginTop: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins_500Medium",
    fontSize: 36,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    fontSize: 18,
  },
  bannerContainer: {
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: "auto",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 10,
  },
  joinBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#6A4C93",
    padding: 20,
    borderRadius: 10,
  },
  createBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#D4AF37",
    padding: 20,
    borderRadius: 10,
  },
  linkText: {
    color: "white",
    fontFamily: "Poppins_400Regular",
    fontSize: 20,
    textAlign: "center",
  },
});
