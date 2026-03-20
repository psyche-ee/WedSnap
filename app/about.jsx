import { Text, View, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Developers from "./components/Developers";

const about = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#E4DFFD]">
      <ScrollView
        contentContainerStyle={{ backgroundColor: "#E4DFFD", flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Link href={"/"} className="absolute top-5 left-5 z-10">
          <Ionicons name="arrow-back" size={24} />
        </Link>
        <View className="mx-auto mt-20">
          <Image source={require("../assets/wedsnap-banner.png")} />
        </View>
        <View className="mt-5 w-4/5 self-center">
          <Text
            className="text-[20px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            About WedSnap
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            WedSnap is dedicated to making wedding memories accessible. We
            believe every smile should be shared the moment it happens, creating
            a collective album for your special day.
          </Text>
        </View>
        <View className="mt-5 w-4/5 self-center">
          <Text
            className="text-[20px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Our Mission
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            To capture and share the magic of every wedding memory,
            effortlessly.
          </Text>
        </View>
        <View className="mt-5 w-4/5 self-center">
          <Text
            className="text-[20px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Why WedSnap?
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            {"\u2022"} Instant Photo Sharing
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            {"\u2022"} Interactive Guest Albums
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            {"\u2022"} Relive Every Moment
          </Text>
          <Text
            className="text-base text-justify"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            {"\u2022"} Simple & Secure
          </Text>
        </View>
        <Developers fixed />
      </ScrollView>
    </SafeAreaView>
  );
};

export default about;
