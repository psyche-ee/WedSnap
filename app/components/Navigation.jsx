import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (route) => pathname === route;

  // 📷 Open Camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
    // 📁 Open Gallery
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const showOptions = () => {
    Alert.alert("Upload", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View className="absolute bottom-5 left-5 right-5 flex-row justify-around items-center bg-white py-3 rounded-full shadow-lg">

      {/* Home */}
      <Link href="/snap" asChild>
        <TouchableOpacity
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            isActive("/snap") ? "bg-[#6A4C93]" : "bg-[#F3F0FA]"
          }`}
        >
          <Ionicons
            name="home"
            size={24}
            color={isActive("/snap") ? "#fff" : "#6A4C93"}
          />
        </TouchableOpacity>
      </Link>

      {/* Gallery */}
      <Link href="/gallery" asChild>
        <TouchableOpacity
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            isActive("/gallery") ? "bg-[#6A4C93]" : "bg-[#F3F0FA]"
          }`}
        >
          <Ionicons
            name="albums"
            size={24}
            color={isActive("/gallery") ? "#fff" : "#6A4C93"}
          />
        </TouchableOpacity>
      </Link>

      {/* Camera */}
      <TouchableOpacity
        onPress={showOptions}
        className={`w-[60px] h-[60px] rounded-full justify-center items-center -mt-6 shadow-lg ${
          isActive("/snap") ? "bg-[#5A3C83]" : "bg-[#6A4C93]"
        }`}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Account */}
      <Link href="/guests" asChild>
        <TouchableOpacity
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            isActive("/guests") ? "bg-[#6A4C93]" : "bg-[#F3F0FA]"
          }`}
        >
          <Ionicons
            name="people"
            size={24}
            color={isActive("/guests") ? "#fff" : "#6A4C93"}
          />
        </TouchableOpacity>
      </Link>

      {/* Settings */}
      <Link href="/settings" asChild>
        <TouchableOpacity
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            isActive("/settings") ? "bg-[#6A4C93]" : "bg-[#F3F0FA]"
          }`}
        >
          <Ionicons
            name="settings"
            size={24}
            color={isActive("/settings") ? "#fff" : "#6A4C93"}
          />
        </TouchableOpacity>
      </Link>

    </View>
  );
};

export default Navigation;