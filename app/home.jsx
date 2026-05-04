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
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { uploadToCloudinary } from "../lib/cloudinary";
import { auth, db } from "../lib/firebase";
import { useWedding } from "../context/WeddingContext";

import PhotoDisplay from "./components/PhotoDisplay";
import Navigation from "./components/Navigation";
import { Ionicons } from "@expo/vector-icons";
import Developers from "./components/Developers";

const Home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const { weddingId } = useWedding();

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("User");
  const [wedding, setWedding] = useState(null);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
         if (!user || !weddingId) {
            setWedding(null);
            return;
          }

        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setUserName(userSnap.data().name || "User");
        }

        if (weddingId) {
          const weddingSnap = await getDoc(
            doc(db, "weddings", weddingId)
          );

          if (weddingSnap.exists()) {
            setWedding(weddingSnap.data());
          } else {
            setWedding(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [weddingId]);

  if (!fontsLoaded) return null;

  // 📸 PHOTO CAMERA ONLY
  const openPhotoCamera = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      setPreview(asset);
      await uploadMedia(asset);
    }
  };

  // 📁 GALLERY
  const openGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      setPreview(asset);
      await uploadMedia(asset);
    }
  };

  // 📌 OPTIONS (PHOTO ONLY)
  const showOptions = () => {
    Alert.alert("Upload Photo", "Choose an option", [
      { text: "Take Photo", onPress: openPhotoCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ☁️ UPLOAD PHOTO ONLY
  const uploadMedia = async (asset) => {
    try {
      const user = auth.currentUser;

      if (!user || !weddingId) {
        Alert.alert("Error", "Wedding not found.");
        return;
      }

      setUploading(true);

      console.log("Uploading photo...");

      const cloudinaryData = await uploadToCloudinary(asset);

      await addDoc(
        collection(db, "weddings", weddingId, "media"),
        {
          uploadedBy: user.uid,
          type: "image",

          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,

          width: cloudinaryData.width || null,
          height: cloudinaryData.height || null,

          createdAt: serverTimestamp(),
        }
      );

      Alert.alert("Success", "Photo uploaded successfully!");
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Upload Failed",
        error.message || "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 gap-5 pb-20"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
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
                {new Date(
                  wedding.dateTime.seconds * 1000
                ).toLocaleDateString()}
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
          disabled={uploading}
          className="flex-row bg-[#7C5CFC] p-4 rounded-xl items-center justify-center gap-2 shadow-sm"
        >
          <Ionicons name="camera" size={24} color="#fff" />

          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        {preview && (
          <Image
            source={{ uri: preview.uri }}
            className="w-[200px] h-[200px] mt-2 rounded-xl self-center"
          />
        )}

        {/* CONTENT */}
        <PhotoDisplay />
      </ScrollView>

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
};

export default Home;