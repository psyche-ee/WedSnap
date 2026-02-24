import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";

const join = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });
  const [code, setCode] = useState();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require("../assets/logo.png")} />
        <Text style={styles.title}>WedSnap</Text>
      </View>
      <Text style={styles.description}>
        Capture and share wedding{"\n"} memories together.
      </Text>
      <View style={styles.bannerContainer}>
        <Image source={require("../assets/wedsnap-banner.png")} />
      </View>
      <Pressable style={styles.scanBtn}>
        <Image source={require("../assets/qr.png")} />
        <Text style={styles.label}>Scan QR Code</Text>
      </Pressable>
      <Text style={styles.or}>or</Text>
      <TextInput
        style={styles.codeInput}
        placeholder="Enter weeding code"
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
      ></TextInput>
      <Link href="/snap" asChild>
        <Pressable style={styles.joinBtn}>
          <Text style={styles.label}>Join</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default join;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4DFFD",
  },
  titleContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
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
    fontSize: 16,
  },
  bannerContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: "auto",
  },
  scanBtn: {
    backgroundColor: "#6A4C93",
    flexDirection: "row",
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    color: "white",
    fontSize: 15,
  },

  or: {
    color: "#757575",
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
  },
  codeInput: {
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 15,
  },
  joinBtn: {
    marginTop: 20,
    width: 150,
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#D4AF37",
    margin: "auto",
  },
});
