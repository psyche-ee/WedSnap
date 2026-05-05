import { Text, View, Image, ScrollView } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function About() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  const FeatureCard = ({ icon, title }) => (
    <View
      className="bg-white rounded-2xl p-4 flex-row items-center mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        className="w-12 h-12 rounded-full justify-center items-center"
        style={{ backgroundColor: "#F2EEFF" }}
      >
        <Ionicons name={icon} size={22} color="#7C5CFC" />
      </View>

      <Text
        className="ml-4 text-base flex-1"
        style={{
          fontFamily: "Poppins_500Medium",
          color: "#333",
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mt-5 mb-4">
          <Text
            className="text-[26px]"
            style={{
              fontFamily: "Poppins_500Medium",
              color: "#333",
            }}
          >
            About WedSnap
          </Text>

          <Text
            className="text-sm mt-1"
            style={{
              fontFamily: "Poppins_400Regular",
              color: "#777",
            }}
          >
            Capture every wedding memory beautifully
          </Text>
        </View>

        {/* Banner */}
        <View className="items-center mb-6">
          <Image
            source={require("../assets/wedsnap-banner.png")}
            className="rounded-3xl"
          />
        </View>

        {/* About */}
        <View className="bg-white rounded-3xl p-5 mb-5">
          <Text
            className="text-lg mb-2"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Our Story
          </Text>

          <Text
            className="text-sm leading-6"
            style={{
              fontFamily: "Poppins_400Regular",
              color: "#666",
            }}
          >
            WedSnap is dedicated to making wedding memories accessible.
            Every smile, laugh, and magical moment deserves to be shared
            instantly with family and friends.
          </Text>
        </View>

        {/* Mission */}
        <View className="bg-white rounded-3xl p-5 mb-5">
          <Text
            className="text-lg mb-2"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Our Mission
          </Text>

          <Text
            className="text-sm leading-6"
            style={{
              fontFamily: "Poppins_400Regular",
              color: "#666",
            }}
          >
            To make capturing, sharing, and reliving wedding memories
            effortless for everyone.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-4">
          <Text
            className="text-lg mb-4"
            style={{
              fontFamily: "Poppins_500Medium",
              color: "#333",
            }}
          >
            Why WedSnap?
          </Text>

          <FeatureCard
            icon="flash"
            title="Instant Photo Sharing"
          />

          <FeatureCard
            icon="images"
            title="Interactive Guest Albums"
          />

          <FeatureCard
            icon="heart"
            title="Relive Every Moment"
          />

          <FeatureCard
            icon="shield-checkmark"
            title="Simple & Secure"
          />
        </View>

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}