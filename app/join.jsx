import { Pressable, Image, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";
import Developers from "./components/Developers";

const join = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });
  const [code, setCode] = useState();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#E4DFFD]">
      <View className="mt-2.5 mb-2.5 flex-row items-center justify-center">
        <Image source={require("../assets/logo.png")} />
        <Text
          className="text-[36px]"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          WedSnap
        </Text>
      </View>
      <Text
        className="text-center text-base"
        style={{ fontFamily: "Poppins_400Regular" }}
      >
        Capture and share wedding{"\n"} memories together.
      </Text>
      <View className="mx-auto mt-5 mb-5">
        <Image source={require("../assets/wedsnap-banner.png")} />
      </View>
      <Pressable className="mx-2.5 flex-row items-center justify-center gap-2 rounded-[5px] bg-[#6A4C93] p-[15px]">
        <Image source={require("../assets/qr.png")} />
        <Text
          className="text-center text-[15px] text-white"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          Scan QR Code
        </Text>
      </Pressable>
      <Text className="my-3 text-center text-base text-[#757575]">or</Text>
      <TextInput
        className="mx-2.5 rounded-[5px] bg-white p-[15px]"
        style={{ fontFamily: "Poppins_400Regular" }}
        placeholder="Enter weeding code"
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
      ></TextInput>
      <Link href="/snap" asChild>
        <Pressable className="mt-5 w-[150px] self-center rounded-[5px] bg-[#D4AF37] p-3">
          <Text
            className="text-center text-[15px] text-white"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Join
          </Text>
        </Pressable>
      </Link>
      <Developers fixed />
    </SafeAreaView>
  );
};

export default join;
