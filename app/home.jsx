import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useLocalSearchParams } from "expo-router";

import PhotoDisplay from "./components/PhotoDisplay";
import VideoDisplay from "./components/VideoDisplay";
import Navigation from "./components/Navigation";
import { Ionicons } from "@expo/vector-icons";
import Developers from "./components/Developers";

const Home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const { weddingId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState("User");
  const [wedding, setWedding] = useState(null);

  // 🔥 FETCH USER NAME FROM FIRESTORE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !weddingId) return;

        // 👤 USER
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setUserName(userSnap.data().name || "User");
        }

        // 💍 WEDDING
        const weddingSnap = await getDoc(doc(db, "weddings", weddingId));
        if (weddingSnap.exists()) {
          setWedding(weddingSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [weddingId]);

  if (!fontsLoaded) return null;

  // 📷 CAMERA
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

  // 📁 GALLERY
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
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 gap-5 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-5">
          <Text
            className="text-[22px]"
            style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
          >
            Welcome, {userName}!
          </Text>

          {wedding && (
            <View className="mt-2">
              <Text
                style={{ fontFamily: "Poppins_500Medium", color: "#7C5CFC" }}
              >
                {wedding.spouseName}
              </Text>

              <Text
                style={{ fontFamily: "Poppins_400Regular", color: "#777" }}
              >
                {new Date(wedding.dateTime.seconds * 1000).toLocaleDateString()}
              </Text>

              <Text
                style={{ fontFamily: "Poppins_400Regular", color: "#777" }}
              >
                📍 {wedding.location}
              </Text>
            </View>
          )}
        </View>

        {/* UPLOAD BUTTON */}
        <TouchableOpacity
          onPress={showOptions}
          className="flex-row bg-[#7C5CFC] p-4 rounded-xl items-center justify-center gap-2 shadow-sm"
        >
          <Ionicons name="camera" size={24} color="#fff" />
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Upload Photo or Video
          </Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        {image && (
          <Image
            source={{ uri: image }}
            className="w-[200px] h-[200px] mt-2 rounded-xl self-center"
          />
        )}

        {/* CONTENT */}
        <PhotoDisplay />
        <VideoDisplay />

        <Developers />
      </ScrollView>

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
};

export default Home;