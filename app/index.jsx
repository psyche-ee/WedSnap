import { Text, View, Image, Pressable } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const index = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#E4DFFD]">
      <Link href="/about" className="absolute top-[60px] right-[30px]">
        <Ionicons name="information-circle-outline" size={24} />
      </Link>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 150, height: 150 }}
      />
      <Text className="text-[36px]" style={{ fontFamily: "Poppins_500Medium" }}>
        WedSnap
      </Text>
      <Text
        className="text-[18px]"
        style={{ fontFamily: "Poppins_400Regular" }}
      >
        The Snap of a Lifetime
      </Text>

      <View className="mt-[100px] w-4/5 flex-col gap-5">
        <Link href="/login" asChild>
          <Pressable className="w-full items-center rounded-[10px] bg-[#6A4C93] p-[14px]">
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Login
            </Text>
          </Pressable>
        </Link>
        <Link href="/signup" asChild>
          <Pressable className="w-full items-center rounded-[10px] bg-[#D4AF37] p-[14px]">
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Sign Up
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default index;
