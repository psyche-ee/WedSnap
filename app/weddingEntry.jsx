import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  Image,
  ImageBackground,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

import { useRouter } from "expo-router";
import Navigation from "./components/Navigation";
import Header from "./components/Header";

import { useWedding } from "../context/WeddingContext";

const Dashboard = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({ Poppins_500Medium, Poppins_400Regular });

  // MODALS
  const [joinModal, setJoinModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  // JOIN
  const [code, setCode] = useState("");

  // CREATE
  const [spouseName, setSpouseName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const { weddingId, setWeddingId, wedding, setWedding } = useWedding();
  const hasWedding = !!weddingId || !!wedding;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth/login");
    });

    return unsub;
  }, []);

  // track keyboard height so modal can sit flush above it (no visible gap)
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (!fontsLoaded) return null;

  // ================= JOIN =================
  const handleJoin = async () => {
    if (!code) return Alert.alert("Enter invite code");

    try {
      setLoading(true);

      const user = auth.currentUser;

      const q = query(
        collection(db, "weddings"),
        where("inviteCode", "==", code.toUpperCase()),
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        Alert.alert("Invalid code");
        return;
      }

      const docSnap = snap.docs[0];

      await updateDoc(docSnap.ref, {
        participants: arrayUnion(user.uid),
      });

      setWedding({ id: docSnap.id, ...docSnap.data() });
      setWeddingId(docSnap.id);
      setJoinModal(false);

      Alert.alert("Success", "Joined wedding!");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!spouseName || !location || !date || !time) {
      return Alert.alert("Fill all fields");
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      const inviteCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const dateTime = new Date(`${date} ${time}`);

      const docRef = await addDoc(collection(db, "weddings"), {
        userId: user.uid,
        spouseName,
        location,
        inviteCode,
        dateTime,
        participants: [user.uid],
        createdAt: serverTimestamp(),
      });

      setCreateModal(false);
      setWedding({ id: docRef.id, spouseName, location, inviteCode, dateTime });
      setWeddingId(docRef.id);

      Alert.alert("Success", `Invite Code: ${inviteCode}`);

      router.push("/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <Header />

      {/* WEDDING CARD (UI only) */}
      {hasWedding && wedding && (
        <View className="mx-5 mt-4 overflow-hidden rounded-2xl shadow-md">
          <ImageBackground
            source={require("../assets/wedsnap-banner.png")}
            className="w-full h-36"
            imageStyle={{ resizeMode: "cover" }}
          >
            <View className="absolute inset-0 bg-black/40" />

            <View className="absolute left-4 top-4 flex-row items-center">
              <View className="w-14 h-14 rounded-full bg-white/30 items-center justify-center">
                <Text
                  className="text-white text-lg font-semibold"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  {String(wedding.spouseName || "?")
                    .split(" ")
                    .map((s) => s?.[0])
                    .join("")
                    .slice(0, 2)}
                </Text>
              </View>

              <View className="ml-3">
                <Text
                  className="text-white text-xl"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  {wedding.spouseName}
                </Text>
                <Text className="text-white/90 text-sm mt-0.5">
                  📍 {wedding.location}
                </Text>
              </View>
            </View>

            <View className="absolute right-4 top-4 bg-white/90 rounded-full px-3 py-1 flex-row items-center">
              <Text className="text-sm text-[#7C5CFC] font-semibold mr-2">{wedding.inviteCode}</Text>
              <Pressable
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(wedding.inviteCode || "");
                    Alert.alert("Copied", "Invite code copied to clipboard");
                  } catch (err) {
                    Alert.alert("Error", "Could not copy code");
                  }
                }}
                hitSlop={6}
              >
                <Ionicons name="copy-outline" size={16} color="#7C5CFC" />
              </Pressable>
            </View>
          </ImageBackground>

          <View className="bg-white p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#F4F2FF] rounded-full px-3 py-1">
                  <Text className="text-[#6B46FF] font-semibold">Event</Text>
                </View>

                <View>
                  <Text className="text-sm text-gray-700">
                    {wedding.dateTime?.seconds
                      ? new Date(
                          wedding.dateTime.seconds * 1000,
                        ).toLocaleDateString()
                      : "No date"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {wedding.dateTime?.seconds
                      ? new Date(
                          wedding.dateTime.seconds * 1000,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No time"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center bg-[#FFF7ED] px-3 py-2 rounded-lg">
                  <Ionicons name="location-outline" size={16} color="#F59E0B" />
                  <Text className="text-xs text-[#92400E] ml-2">
                    {wedding.location}
                  </Text>
                </View>
              </View>
            </View>

            <Text className="text-gray-500 mt-3 text-sm">
              Hosted by you • Participants: {wedding.participants?.length ?? 1}
            </Text>
          </View>
        </View>
      )}

      {/* BANNER (only show when no active wedding) */}
      {!hasWedding && (
        <View className="mt-6 mx-5 rounded-2xl bg-white overflow-hidden">
          <Image
            source={require("../assets/wedsnap-banner.png")}
            className="w-full h-40"
          />
        </View>
      )}

      {/* ACTION BUTTONS */}
      <View className="flex-row gap-4 px-5 mt-6">
        <Pressable
          onPress={() => setJoinModal(true)}
          className="flex-1 bg-white rounded-3xl border border-[#E4E1FF] p-5 shadow-sm active:scale-95"
        >
          <View className="items-center">
            <Text
              className="text-[#7C5CFC] text-base text-center"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              {hasWedding ? "Switch Wedding" : "Join Wedding"}
            </Text>
            <Text className="text-[#8A8A8A] text-xs mt-1 text-center">
              {hasWedding ? "Change active event" : "Enter invite code"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setCreateModal(true)}
          className="flex-1 bg-white rounded-3xl border border-[#E4E1FF] p-5 shadow-sm active:scale-95"
        >
          <View className="items-center">
            <Text
              className="text-[#7C5CFC] text-base text-center"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Create Wedding
            </Text>
            <Text className="text-[#8A8A8A] text-xs mt-1 text-center">
              Host your own event
            </Text>
          </View>
        </Pressable>
      </View>

      {/* JOIN MODAL */}
      <Modal visible={joinModal} transparent animationType="fade">
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => setJoinModal(false)}>
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />
          </TouchableWithoutFeedback>

          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: keyboardHeight,
              maxHeight: screenHeight * 0.85,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                className="bg-white p-5 rounded-t-2xl"
                style={{
                  paddingBottom: Platform.OS === "ios" ? 40 : 20,
                  alignSelf: "stretch",
                  maxHeight: screenHeight * 0.85,
                }}
              >
                <TextInput
                  placeholder="Invite Code"
                  value={code}
                  onChangeText={setCode}
                  className="border p-3 rounded-xl mb-4"
                />
                <Pressable
                  onPress={handleJoin}
                  className="bg-[#7C5CFC] p-4 rounded-xl"
                >
                  <Text className="text-white text-center">Join</Text>
                </Pressable>
                <Pressable onPress={() => setJoinModal(false)}>
                  <Text className="text-center mt-3">Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CREATE MODAL */}
      <Modal visible={createModal} transparent animationType="fade">
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => setCreateModal(false)}>
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />
          </TouchableWithoutFeedback>

          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: keyboardHeight,
              maxHeight: screenHeight * 0.85,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                className="bg-white p-5 rounded-t-2xl gap-3"
                style={{
                  paddingBottom: Platform.OS === "ios" ? 40 : 20,
                  alignSelf: "stretch",
                  maxHeight: screenHeight * 0.85,
                }}
              >
                <TextInput
                  placeholder="Spouse Name"
                  value={spouseName}
                  onChangeText={setSpouseName}
                  className="border p-3 rounded-xl"
                />
                <TextInput
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                  className="border p-3 rounded-xl"
                />
                <TextInput
                  placeholder="Date (YYYY-MM-DD)"
                  value={date}
                  onChangeText={setDate}
                  className="border p-3 rounded-xl"
                />
                <TextInput
                  placeholder="Time (HH:MM)"
                  value={time}
                  onChangeText={setTime}
                  className="border p-3 rounded-xl"
                />

                <Pressable
                  onPress={handleCreate}
                  className="bg-[#7C5CFC] p-4 rounded-xl mt-2"
                >
                  <Text className="text-white text-center">Create Wedding</Text>
                </Pressable>

                <Pressable onPress={() => setCreateModal(false)}>
                  <Text className="text-center mt-3">Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
};

export default Dashboard;
