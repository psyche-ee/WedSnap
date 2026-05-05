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
import { useRouter } from "expo-router";
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
  const [organizerName, setOrganizerName] = useState("");

  const toPascalCase = (value) =>
    String(value || "")
      .trim()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        // fetch current user name even if no active wedding
        if (user) {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) {
            setUserName(toPascalCase(userSnap.data().name || "User"));
          }
        }

        if (!weddingId) {
          setWedding(null);
          setOrganizerName("");
          return;
        }

        // only fetch wedding when weddingId is present
        const userSnap = user ? await getDoc(doc(db, "users", user.uid)) : null;
        if (userSnap && userSnap.exists()) {
          setUserName(toPascalCase(userSnap.data().name || "User"));
        }

        if (weddingId) {
          const weddingSnap = await getDoc(doc(db, "weddings", weddingId));

          if (weddingSnap.exists()) {
            const w = weddingSnap.data();
            setWedding(w);

            try {
              const ownerId = w.userId || w.userUID || null;
              if (ownerId) {
                const ownerSnap = await getDoc(
                  doc(db, "users", String(ownerId)),
                );
                if (ownerSnap.exists()) {
                  const od = ownerSnap.data();
                  setOrganizerName(
                    od.name ||
                      od.displayName ||
                      (od.email ? od.email.split("@")[0] : ""),
                  );
                } else {
                  setOrganizerName("");
                }
              } else {
                setOrganizerName("");
              }
            } catch (err) {
              console.log("resolve organizer name error", err);
              setOrganizerName("");
            }
          } else {
            setWedding(null);
            setOrganizerName("");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [weddingId]);

  if (!fontsLoaded) return null;
  const router = useRouter();

  // 📸 PHOTO CAMERA ONLY
  const openPhotoCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

      await addDoc(collection(db, "weddings", weddingId, "media"), {
        uploadedBy: user.uid,
        type: "image",

        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,

        width: cloudinaryData.width || null,
        height: cloudinaryData.height || null,

        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Photo uploaded successfully!");
    } catch (error) {
      console.log(error);

      Alert.alert("Upload Failed", error.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      {!wedding ? (
        // 🎉 EMPTY STATE - No Active Wedding
        <ScrollView
          contentContainerClassName="flex-1 px-5 justify-center items-center pb-20"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            {/* ICON */}
            <View
              className="bg-gradient-to-b from-[#E0D4FF] to-[#F0EAFF] p-6 rounded-full mb-6"
              style={{
                width: 120,
                height: 120,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/wedsnap.png")}
                style={{ width: 125, height: 125, opacity: 1 }}
                resizeMode="contain"
              />
            </View>

            {/* GREETING */}
            <Text
              className="text-[28px] text-center"
              style={{
                fontFamily: "Poppins_500Medium",
                color: "#111",
                marginBottom: 8,
              }}
            >
              Welcome, {userName}!
            </Text>

            {/* SUBTITLE */}
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                color: "#666",
                fontSize: 16,
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Join an existing wedding or create a new one to start sharing
              memories with your loved ones.
            </Text>

            {/* CTA BUTTONS */}
            <View className="gap-3 w-full">
              {/* JOIN / CREATE - go to wedding entry */}
              <TouchableOpacity
                onPress={() => router.push("/weddingEntry")}
                className="bg-[#7C5CFC] rounded-2xl py-4 flex-row items-center justify-center gap-2 px-5"
                style={{
                  shadowColor: "#7C5CFC",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Ionicons name="link-outline" size={20} color="#fff" />
                <Text
                  className="text-white text-[16px]"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  Join or Create Wedding
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        // 📸 ACTIVE WEDDING - Current Layout
        <ScrollView
          contentContainerClassName="px-5 gap-5 pb-20"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View className="pt-5">
            <View className="flex-row items-start justify-between">
              <View style={{ flex: 1 }}>
                <Text
                  className="text-[22px]"
                  style={{ fontFamily: "Poppins_500Medium", color: "#111" }}
                >
                  Welcome, {userName}!
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#6B46FF",
                    marginTop: 6,
                    fontSize: 16,
                  }}
                >
                  {(() => {
                    const toPascalCase = (value) =>
                      String(value || "")
                        .trim()
                        .split(/[^a-zA-Z0-9]+/)
                        .filter(Boolean)
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() +
                            part.slice(1).toLowerCase(),
                        )
                        .join("");

                    const spouse = toPascalCase(wedding.spouseName);
                    const org = toPascalCase(organizerName);
                    if (spouse && org) return `${spouse} & ${org}`;
                    if (spouse) return spouse;
                    if (org) return org;
                    return "Wedding";
                  })()}
                </Text>
              </View>

              <View className="ml-3">
                <View
                  className="bg-white p-3 rounded-2xl"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 4,
                    minWidth: 140,
                  }}
                >
                  <Text
                    style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
                  >
                    {new Date(
                      wedding.dateTime.seconds * 1000,
                    ).toLocaleDateString()}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#F59E0B"
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins_400Regular",
                        color: "#777",
                        marginLeft: 8,
                      }}
                    >
                      {wedding.location}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
      )}

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
};

export default Home;
