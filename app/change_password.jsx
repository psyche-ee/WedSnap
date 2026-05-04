import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import Header from "./components/Header";
import Developers from "./components/Developers";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingPassword, setLoadingPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Error", "You need to login again.");
      router.replace("/auth/login");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }

    try {
      setLoadingPassword(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Password changed successfully.");
      router.back();
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert("Error", "Current password is incorrect.");
        return;
      }

      if (error.code === "auth/too-many-requests") {
        Alert.alert("Error", "Too many attempts. Try again later.");
        return;
      }

      Alert.alert(
        "Update Error",
        error.message || "Failed to update password.",
      );
    } finally {
      setLoadingPassword(false);
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
            Change Password
          </Text>

          <View className="w-full gap-1">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
              Current Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Enter current password"
                placeholderTextColor="#aaa"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                className="bg-[#F1F0FF] py-3 px-4 pr-12 rounded-xl border border-[#E4E1FF]"
              />
              <Pressable
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#7C5CFC"
                />
              </Pressable>
            </View>
          </View>

          <View className="w-full gap-1">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
              New Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="#aaa"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                className="bg-[#F1F0FF] py-3 px-4 pr-12 rounded-xl border border-[#E4E1FF]"
              />
              <Pressable
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#7C5CFC"
                />
              </Pressable>
            </View>
          </View>

          <View className="w-full gap-1">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
              Confirm New Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="bg-[#F1F0FF] py-3 px-4 pr-12 rounded-xl border border-[#E4E1FF]"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#7C5CFC"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleChangePassword}
            disabled={loadingPassword}
            className="bg-[#7C5CFC] py-3.5 rounded-xl items-center w-full mt-2"
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              {loadingPassword ? "Updating password..." : "Change Password"}
            </Text>
          </Pressable>

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
