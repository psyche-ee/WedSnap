import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useLocalSearchParams } from "expo-router";

import PhotoDisplay from "./components/PhotoDisplay";
import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Gallery() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const { weddingId } = useLocalSearchParams();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 gap-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="mt-5">
          <Text
            className="text-[24px]"
            style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
          >
            Gallery
          </Text>

          <Text
            className="text-[14px] mt-1"
            style={{ fontFamily: "Poppins_400Regular", color: "#777" }}
          >
            View all wedding memories
          </Text>
        </View>

        {/* EMPTY STATE */}
        {!weddingId && (
          <View className="bg-white p-5 rounded-xl mt-5">
            <Text style={{ fontFamily: "Poppins_400Regular", color: "#777" }}>
              No wedding selected. Please join or create a wedding first.
            </Text>
          </View>
        )}

        {/* CONTENT */}
        {weddingId && (
          <>
            <PhotoDisplay weddingId={weddingId} />
            <VideoDisplay weddingId={weddingId} />
          </>
        )}

        <Developers />
      </ScrollView>

      {/* PASS weddingId */}
      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
}
