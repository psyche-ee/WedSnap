import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Developers from "./components/Developers";

const dashboard = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#E4DFFD]">
      <View className="mt-[60px] mb-5 flex-row items-center justify-center">
        <Image source={require("../assets/logo.png")} />
        <Text
          className="text-[36px]"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          WedSnap
        </Text>
      </View>
      <Text
        className="text-center text-[18px]"
        style={{ fontFamily: "Poppins_400Regular" }}
      >
        Capture and share wedding {"\n"} memories together.
      </Text>
      <View className="mx-auto mt-5 mb-[30px]">
        <Image source={require("../assets/wedsnap-banner.png")} />
      </View>
      <View className="flex-row justify-between gap-2.5 p-5">
        <Link href="/join" asChild>
          <Pressable className="flex-1 items-center rounded-[10px] bg-[#6A4C93] p-5">
            <Image source={require("../assets/join.png")} />
            <Text
              className="text-center text-[20px] text-white"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Join a {"\n"}Wedding
            </Text>
          </Pressable>
        </Link>
        <Link href="/create" asChild>
          <Pressable className="flex-1 items-center rounded-[10px] bg-[#D4AF37] p-5">
            <Image source={require("../assets/create.png")} />
            <Text
              className="text-center text-[20px] text-white"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Create a {"\n"}Wedding
            </Text>
          </Pressable>
        </Link>
      </View>
      <Developers fixed />
    </SafeAreaView>
  );
};

export default dashboard;
