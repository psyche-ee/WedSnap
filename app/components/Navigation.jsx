import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const Navigation = ({ weddingId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route) => pathname.startsWith(route);

  // 📷 Camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
  };

  // 📁 Gallery
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
  };

  const showOptions = () => {
    Alert.alert("Upload", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const NavItem = ({ route, icon }) => {
    const active = isActive(route);

    const handlePress = () => {
      if (!weddingId) {
        Alert.alert("Error", "No wedding selected");
        return;
      }

      router.push(`${route}?weddingId=${weddingId}`);
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
          active ? "bg-[#7C5CFC]" : "bg-[#F1F0FF]"
        }`}
        style={
          active
            ? {
                shadowColor: "#7C5CFC",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
              }
            : {}
        }
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? "#fff" : "#7C5CFC"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="absolute bottom-5 left-5 right-5 flex-row justify-between items-center px-4 py-3 rounded-full"
      style={{
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      {/* Home */}
      <NavItem route="/home" icon="home" />

      {/* Gallery */}
      <NavItem route="/dashboard" icon="images" />

      {/* CAMERA (CENTER BUTTON) */}
      <TouchableOpacity
        onPress={showOptions}
        className="w-[65px] h-[65px] rounded-full justify-center items-center -mt-8"
        style={{
          backgroundColor: "#7C5CFC",
          shadowColor: "#7C5CFC",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <Ionicons name="camera" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Guests */}
      <NavItem route="/guests" icon="people" />

      {/* Settings */}
      <NavItem route="/settings" icon="settings" />
    </View>
  );
};

export default Navigation;