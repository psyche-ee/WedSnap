import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from "@expo-google-fonts/poppins";

import PhotoDisplay from "./components/PhotoDisplay";
import VideoDisplay from "./components/VideoDisplay";
import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Gallery() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView
        contentContainerClassName="bg-[#E4DFFD] px-5 gap-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-[22px] mt-5"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          Gallery
        </Text>

        <Text style={{ fontFamily: "Poppins_400Regular" }}>
          View all uploaded memories.
        </Text>

        <PhotoDisplay />
        <VideoDisplay />

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}