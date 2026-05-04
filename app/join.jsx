import {
  Pressable,
  Image,
  Text,
  View,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

import Developers from "./components/Developers";

const Join = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) return null;

  const handleJoin = async () => {
    if (!code) {
      Alert.alert("Error", "Enter invitation code");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Not logged in");
        return;
      }

      const q = query(
        collection(db, "weddings"),
        where("inviteCode", "==", code.toUpperCase())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("Error", "Invalid code");
        return;
      }

      const weddingDoc = snapshot.docs[0];

      await updateDoc(weddingDoc.ref, {
        participants: arrayUnion(user.uid),
      });

      Alert.alert("Success", "Joined wedding!");

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF] justify-center items-center px-5">
      {/* HEADER */}
      <View className="items-center mb-6">
        <Image source={require("../assets/wedsnap.png")} className="w-32 h-32" />
        <Text
          className="text-[28px]"
          style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
        >
          Join Wedding
        </Text>
      </View>

      {/* CARD */}
      <View className="w-full bg-white p-6 rounded-2xl gap-5 shadow-md">
        {/* INPUT */}
        <Text
          style={{ fontFamily: "Poppins_400Regular", color: "#555" }}
        >
          Invitation Code
        </Text>

        <TextInput
          placeholder="Enter code (e.g. AB12CD)"
          placeholderTextColor="#aaa"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          className="bg-[#F1F0FF] p-4 rounded-xl border border-[#E4E1FF] text-center text-lg tracking-widest"
        />

        {/* BUTTON */}
        <Pressable
          onPress={handleJoin}
          disabled={loading}
          className="bg-[#7C5CFC] p-4 rounded-xl items-center"
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {loading ? "Joining..." : "Join Wedding"}
          </Text>
        </Pressable>

        {/* OPTIONAL QR (disabled for now) */}
        <Pressable className="flex-row items-center justify-center gap-2 mt-2">
          <Image source={require("../assets/qr.png")} />
          <Text
            style={{ fontFamily: "Poppins_400Regular", color: "#888" }}
          >
            Scan QR (coming soon)
          </Text>
        </Pressable>
      </View>

      <Developers fixed />
    </SafeAreaView>
  );
};

export default Join;