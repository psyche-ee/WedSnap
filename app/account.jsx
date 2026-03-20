import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Account() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView className="bg-[#E4DFFD]" contentContainerClassName="px-5 pb-24 gap-6 items-center">

        {/* Header */}
        <View className="mt-5 items-center">
          <Text className="text-[26px]" style={{ fontFamily: "Poppins_500Medium" }}>
            My Account
          </Text>
        </View>

        {/* Profile Card */}
        <View className="w-full bg-white rounded-2xl p-5 items-center shadow-sm">
          <Image
            source={require("../assets/1.png")}
            className="w-[90px] h-[90px] rounded-full mb-3"
          />

          <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-lg">
            Username
          </Text>

          <Text className="text-gray-500 text-sm">
            user@email.com
          </Text>
        </View>

        {/* Actions */}
        <View className="w-full gap-3">
          <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
            <View className="flex-row items-center gap-3">
              <Ionicons name="create" size={20} color="#6A4C93" />
              <Text>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        <Link href="/login" asChild>
            <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                <View className="flex-row items-center gap-3">
                <Ionicons name="log-out" size={20} color="#E63946" />
                <Text className="text-red-500">Logout</Text>
                </View>
            </TouchableOpacity>
        </Link>
        </View>

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}