import { Text, TextInput, View, Pressable, Alert } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth, db } from "../../lib/firebase"; // adjust path if needed
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import Developers from "../components/Developers";
import Header from "../components/Header";

const Signup = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 🔐 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 💾 2. Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created!");

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 bg-[#E4DFFD]">
      <Header />

      <View className="items-center bg-white p-5 rounded-[10px] w-[80%] gap-2.5">
        <Text
          className="text-[24px] mb-2.5"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          Sign up
        </Text>

        {/* EMAIL */}
        <View className="w-full">
          <Text style={{ fontFamily: "Poppins_400Regular" }}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            className="bg-[#EEEEFB] py-2.5 px-4 rounded-lg border border-[#D9D9D9]"
          />
        </View>

        {/* PASSWORD */}
        <View className="w-full">
          <Text style={{ fontFamily: "Poppins_400Regular" }}>Password</Text>

          <View className="relative">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="bg-[#EEEEFB] py-2.5 px-4 pr-12 rounded-lg border border-[#D9D9D9]"
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </Pressable>
          </View>
        </View>

        {/* CONFIRM PASSWORD */}
        <View className="w-full">
          <Text style={{ fontFamily: "Poppins_400Regular" }}>
            Confirm Password
          </Text>

          <View className="relative">
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              className="bg-[#EEEEFB] py-2.5 px-4 pr-12 rounded-lg border border-[#D9D9D9]"
            />

            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </Pressable>
          </View>
        </View>

        {/* SIGNUP BUTTON */}
        <Pressable
          onPress={handleSignup}
          disabled={loading}
          className="bg-[#6A4C93] py-3.5 rounded-[10px] items-center w-full my-2.5"
        >
          <Text
            className="text-white"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {loading ? "Signing up..." : "Sign up"}
          </Text>
        </Pressable>

        {/* LOGIN LINK */}
        <Pressable onPress={() => router.push("/login")}>
          <Text
            className="text-[14px] text-[#B3B3B3]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Already have an account?{" "}
            <Text className="text-[#6A4C93]">Login</Text>
          </Text>
        </Pressable>
      </View>

      <Developers fixed />
    </View>
  );
};

export default Signup;