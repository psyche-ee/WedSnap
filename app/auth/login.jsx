import { Text, TextInput, View, Pressable, Alert } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth } from "../../lib/firebase"; // adjust path if needed
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

      Alert.alert("Success", "Logged in!");

      router.replace("/dashboard"); // only redirect AFTER login
    } catch (error) {
      Alert.alert("Login Error", error.message);
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
          Login
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

        {/* FORGOT PASSWORD */}
        <Pressable onPress={() => router.push("/forgotPassword")}>
          <Text className="text-[14px] text-[#B3B3B3] self-start">
            Forgot password?
          </Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-[#6A4C93] py-3.5 rounded-[10px] items-center w-full my-2.5"
        >
          <Text
            className="text-white"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        {/* SIGNUP LINK */}
        <Pressable onPress={() => router.push("/signup")}>
          <Text
            className="text-[14px] text-[#B3B3B3]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Don’t have an account?{" "}
            <Text className="text-[#6A4C93]">Register here.</Text>
          </Text>
        </Pressable>
      </View>

      <Developers fixed />
    </View>
  );
};

export default Login;