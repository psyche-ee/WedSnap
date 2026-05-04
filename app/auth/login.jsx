import { Text, TextInput, View, Pressable, Alert } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import Developers from "../components/Developers";
import Header from "../components/Header";

const Login = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-6 bg-[#F7F5FF]">
      <Header />

      {/* CARD */}
      <View className="items-center bg-white p-6 rounded-2xl w-[85%] gap-4 shadow-md">
        <Text
          className="text-[26px]"
          style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
        >
          Welcome Back
        </Text>

        {/* EMAIL */}
        <View className="w-full gap-1">
          <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
            Email
          </Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            className="bg-[#F1F0FF] py-3 px-4 rounded-xl border border-[#E4E1FF]"
          />
        </View>

        {/* PASSWORD */}
        <View className="w-full gap-1">
          <Text style={{ fontFamily: "Poppins_400Regular", color: "#555" }}>
            Password
          </Text>

          <View className="relative">
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="bg-[#F1F0FF] py-3 px-4 pr-12 rounded-xl border border-[#E4E1FF]"
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#7C5CFC"
              />
            </Pressable>
          </View>
        </View>

        {/* FORGOT PASSWORD */}
        <View className="w-full">
          <Pressable onPress={() => router.push("/forgotPassword")}>
            <Text
              className="text-[13px]"
              style={{ color: "#7C5CFC", fontFamily: "Poppins_400Regular" }}
            >
              Forgot password?
            </Text>
          </Pressable>
        </View>

        {/* LOGIN BUTTON */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-[#7C5CFC] py-3.5 rounded-xl items-center w-full mt-2 shadow-sm"
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        {/* SIGNUP LINK */}
        <Pressable onPress={() => router.push("/auth/signup")}>
          <Text
            className="text-[14px]"
            style={{ fontFamily: "Poppins_400Regular", color: "#8A8A8A" }}
          >
            Don’t have an account?{" "}
            <Text style={{ color: "#7C5CFC" }}>Register here</Text>
          </Text>
        </Pressable>
      </View>

      <Developers fixed />
    </View>
  );
};

export default Login;