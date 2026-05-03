import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Link, useRouter } from "expo-router";
import {
  Pressable,
  Text,
  View,
  Image,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Developers from "./components/Developers";
import Header from "./components/Header";

const Dashboard = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth/login");
    });

    return unsubscribe;
  }, []);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
      Alert.alert("Success", "Logged out!");
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">

      {/* TOP BAR */}
      <View className="flex-row justify-end items-center px-5 pt-3">
        <Pressable
          onPress={() => setMenuVisible(true)}
          className="p-2 rounded-full"
        >
          <Text className="text-[#7C5CFC] text-2xl">⋯</Text>
        </Pressable>
      </View>

      <Header />

      {/* SETTINGS MENU MODAL */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setMenuVisible(false)}
        >
          <View className="absolute right-5 top-20 w-52 bg-white rounded-2xl border border-[#E4E1FF] shadow-lg overflow-hidden">

            {/* ACCOUNT */}
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push("/account");
              }}
              className="px-4 py-3 border-b border-[#F1F0FF]"
            >
              <Text
                className="text-[#7C5CFC]"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                Account Details
              </Text>
            </Pressable>

            {/* LOGOUT */}
            <Pressable
              onPress={handleLogout}
              className="px-4 py-3"
            >
              <Text
                className="text-red-400"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                Logout
              </Text>
            </Pressable>

          </View>
        </Pressable>
      </Modal>

      {/* BANNER */}
      <View className="mt-6 mx-5 rounded-2xl bg-white border border-[#E4E1FF] shadow-sm overflow-hidden">
        <Image
          source={require("../assets/wedsnap-banner.png")}
          className="w-full h-40"
          resizeMode="cover"
        />
      </View>

      {/* ACTION CARDS */}
      <View className="flex-row gap-4 px-5 mt-6">

        {/* JOIN */}
        <Link href="/join" asChild>
          <Pressable className="flex-1 bg-white border border-[#E4E1FF] rounded-2xl p-5 items-center shadow-sm">
            <View className="bg-[#F1F0FF] p-3 rounded-xl mb-3">
              <Image source={require("../assets/join.png")} />
            </View>

            <Text
              className="text-[#7C5CFC] text-lg text-center"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Join{"\n"}Wedding
            </Text>

            <Text
              className="text-[#8A8A8A] text-xs mt-1 text-center"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Enter a wedding event
            </Text>
          </Pressable>
        </Link>

        {/* CREATE */}
        <Link href="/create" asChild>
          <Pressable className="flex-1 bg-white border border-[#E4E1FF] rounded-2xl p-5 items-center shadow-sm">
            <View className="bg-[#F1F0FF] p-3 rounded-xl mb-3">
              <Image source={require("../assets/create.png")} />
            </View>

            <Text
              className="text-[#7C5CFC] text-lg text-center"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Create{"\n"}Wedding
            </Text>

            <Text
              className="text-[#8A8A8A] text-xs mt-1 text-center"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Host your own event
            </Text>
          </Pressable>
        </Link>
      </View>

      {/* ACCENT LINE */}
      <View className="mt-6 mx-5 h-[2px] bg-[#E4E1FF] rounded-full" />

      {/* DEVELOPERS */}
      <View className="mt-auto">
        <Developers fixed />
      </View>

    </SafeAreaView>
  );
};

export default Dashboard;