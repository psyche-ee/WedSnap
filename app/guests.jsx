import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from "@expo-google-fonts/poppins";

import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Guests() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  // Sample guests data
  const guests = [
    { id: 1, name: "John Doe", role: "Guest", avatar: require("../assets/1.png") },
    { id: 2, name: "Jane Smith", role: "Guest", avatar: require("../assets/2.png") },
    { id: 3, name: "Kent Buno", role: "Photographer", avatar: require("../assets/3.png") },
    { id: 4, name: "Eduardo Belda", role: "Organizer", avatar: require("../assets/1.png") },
    { id: 5, name: "Alice Johnson", role: "Guest", avatar: require("../assets/2.png") },
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView className="bg-[#E4DFFD]" contentContainerClassName="px-5 pb-24 gap-5">

        {/* Header */}
        <View className="mt-5">
          <Text className="text-[26px]" style={{ fontFamily: "Poppins_500Medium" }}>
            Guests
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            See who’s attending the wedding
          </Text>
        </View>

        {/* Guest List */}
        <View className="gap-4 mt-3">
          {guests.map((guest) => (
            <View key={guest.id} className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm">
              
              {/* Avatar */}
              <Image
                source={guest.avatar}
                className="w-[60px] h-[60px] rounded-full"
              />

              {/* Name + Role */}
              <View className="ml-4 flex-1">
                <Text className="text-lg" style={{ fontFamily: "Poppins_500Medium" }}>
                  {guest.name}
                </Text>
                <Text className="text-gray-500" style={{ fontFamily: "Poppins_400Regular" }}>
                  {guest.role}
                </Text>
              </View>

              {/* Optional Status Badge */}
              <View className="bg-[#6A4C93] px-3 py-1 rounded-full">
                <Text className="text-white text-sm" style={{ fontFamily: "Poppins_400Regular" }}>
                  Attending
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}