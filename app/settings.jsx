import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Settings() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  const router = useRouter();

  // Generic setting item with optional danger style
  const SettingItem = ({ icon, title, danger, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={"flex-row items-center justify-between p-4 rounded-2xl shadow-sm bg-white"}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={"p-2 rounded-full bg-[#F3F0FA]"}
        >
          <Ionicons
            name={icon}
            size={20}
            color={danger ? "#C62828" : "#6A4C93"}
          />
        </View>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            color: danger ? "#C62828" : "#000",
          }}
        >
          {title}
        </Text>
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView className="bg-[#E4DFFD]" contentContainerClassName="px-5 pb-24 gap-6">

        {/* Header */}
        <View className="mt-5">
          <Text className="text-[26px]" style={{ fontFamily: "Poppins_500Medium" }}>
            Settings
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Manage your preferences
          </Text>
        </View>

        {/* Account Card */}
        <View className="bg-white rounded-2xl p-5 items-center shadow-sm">
          <Image
            source={require("../assets/1.png")}
            className="w-[90px] h-[90px] rounded-full mb-3"
          />
          <Text className="text-lg" style={{ fontFamily: "Poppins_500Medium" }}>
            Username
          </Text>
          <Text className="text-gray-500 text-sm">
            user@email.com
          </Text>
        </View>

        {/* Settings Section */}
        <View className="gap-3">
          <SettingItem icon="lock-closed" title="Change Password" />
          <SettingItem icon="notifications" title="Notifications" />
          <SettingItem icon="shield-checkmark" title="Privacy" />
          <SettingItem icon="information-circle" title="About App" />
          <Link href="/login" asChild>
            <SettingItem icon="log-out" title="Log Out" danger onPress={() => router.push("/login")} />
          </Link>
        </View>

        {/* Join Another Wedding Button */}
        <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-[#D4AF37] p-4 rounded-2xl shadow-sm">
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text className="text-white text-[16px]" style={{ fontFamily: "Poppins_500Medium" }}>
            Join Another Wedding
          </Text>
        </TouchableOpacity>

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}