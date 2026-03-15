import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from "@expo-google-fonts/poppins";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import PhotoDisplay from "./components/PhotoDisplay";
import VideoDisplay from "./components/VideoDisplay";
import Navigation from "./components/Navigation";
import { Ionicons } from "@expo/vector-icons";

const Snap = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [image, setImage] = useState(null);

  if (!fontsLoaded) {
    return null;
  }

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
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView
        contentContainerClassName="bg-[#E4DFFD] px-5 gap-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-5 flex-row justify-between items-center">
          <Text
            className="text-[20px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Welcome Username
          </Text>

          <View className="flex-row pl-2.5">
            <Image
              source={require("../assets/1.png")}
              className="w-[30px] h-[30px] rounded-full -ml-2.5 border-2 border-[#E4DFFD]"
              style={{ zIndex: 3 }}
            />
            <Image
              source={require("../assets/2.png")}
              className="w-[30px] h-[30px] rounded-full -ml-2.5 border-2 border-[#E4DFFD]"
              style={{ zIndex: 2 }}
            />
            <Image
              source={require("../assets/3.png")}
              className="w-[30px] h-[30px] rounded-full -ml-2.5 border-2 border-[#E4DFFD]"
              style={{ zIndex: 1 }}
            />
          </View>
        </View>

        <Text
          className="text-[16px]"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          Upload and view wedding memories.
        </Text>

        <TouchableOpacity
          onPress={showOptions}
          className="flex-row bg-[#D4AF37] p-4 rounded-[10px] items-center justify-center gap-2.5"
        >
          <Ionicons name="camera" size={32} color="#fff" />
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Upload Photo or Video
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            className="w-[200px] h-[200px] mt-2.5 rounded-[10px] self-center"
          />
        )}

        <PhotoDisplay />
        <VideoDisplay />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
};

export default Snap;