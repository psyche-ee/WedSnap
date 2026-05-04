import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import Header from "./components/Header";
import Developers from "./components/Developers";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loadingName, setLoadingName] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    setName(user.displayName || "");
    setEmail(user.email || "");
  }, [router]);

  if (!fontsLoaded) return null;

  const handleChangeName = async () => {
    const user = auth.currentUser;
    const trimmedName = name.trim();

    if (!user) {
      Alert.alert("Error", "You need to login again.");
      router.replace("/auth/login");
      return;
    }

    if (!trimmedName) {
      Alert.alert("Error", "Please enter a name.");
      return;
    }

    try {
      setLoadingName(true);

      await updateProfile(user, { displayName: trimmedName });

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: trimmedName,
          email: user.email,
          uid: user.uid,
        },
        { merge: true },
      );

      Alert.alert("Success", "Name updated successfully.");
    } catch (error) {
      Alert.alert("Update Error", error.message || "Failed to update name.");
    } finally {
      setLoadingName(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F7F5FF]"
      contentContainerClassName="pb-8"
    >
      <View className="items-center gap-6 pt-6">
        <Header />

        <View className="items-center bg-white p-6 rounded-2xl w-[88%] gap-4 shadow-md">
          <Text
            className="text-[26px]"
            style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
          >
            Edit Profile
          </Text>

          <View className="w-full gap-1">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
              Email
            </Text>
            <TextInput
              value={email}
              editable={false}
              className="bg-[#F1F0FF] py-3 px-4 rounded-xl border border-[#E4E1FF] text-[#777]"
            />
          </View>

          <View className="w-full gap-1">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
              Change Name
            </Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              className="bg-[#F1F0FF] py-3 px-4 rounded-xl border border-[#E4E1FF]"
            />
            <Pressable
              onPress={handleChangeName}
              disabled={loadingName}
              className="bg-[#7C5CFC] py-3.5 rounded-xl items-center w-full mt-2"
            >
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {loadingName ? "Saving name..." : "Save Name"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="bg-[#E4E1FF] py-3.5 rounded-xl items-center w-full"
          >
            <Text style={{ fontFamily: "Poppins_500Medium", color: "#7C5CFC" }}>
              Back
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
