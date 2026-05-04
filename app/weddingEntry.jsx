import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import {
  Pressable,
  Text,
  View,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

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

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

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

  if (!fontsLoaded) return null;

  // ================= JOIN =================
  const handleJoin = async () => {
    if (!code) return Alert.alert("Enter invite code");

    try {
      setLoading(true);

      const user = auth.currentUser;

      const q = query(
        collection(db, "weddings"),
        where("inviteCode", "==", code.toUpperCase())
      );

      const snap = await getDocs(q);

      if (snap.empty) return Alert.alert("Invalid code");

      const docSnap = snap.docs[0];

      await updateDoc(docSnap.ref, {
        participants: arrayUnion(user.uid),
      });

      setWedding({
        id: docSnap.id,
        ...docSnap.data(),
      });

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

      // combine date + time
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
      setWedding({
        id: docRef.id,
        spouseName,
        location,
        inviteCode,
        dateTime,
      });

      setWeddingId(docRef.id);

      Alert.alert("Success", `Invite Code: ${inviteCode}`);

      router.push("/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">

      <Header />

      {/* WEDDING CARD */}
      {hasWedding && wedding && (
        <View className="mx-5 mt-4 p-5 bg-white rounded-2xl border border-[#E4E1FF]">
          <Text className="text-[#7C5CFC] text-lg"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {wedding.spouseName}
          </Text>

          <Text className="text-gray-600 mt-1">📍 {wedding.location}</Text>

          <Text className="text-gray-600">
            📅{" "}
            {wedding.dateTime?.seconds
              ? new Date(wedding.dateTime.seconds * 1000).toLocaleDateString()
              : "No date"}
          </Text>

          <Text className="text-gray-600">
            ⏰{" "}
            {wedding.dateTime?.seconds
              ? new Date(wedding.dateTime.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No time"}
          </Text>

          <Text className="text-gray-500 mt-1">
            🔑 {wedding.inviteCode}
          </Text>
        </View>
      )}

      {/* BANNER */} 
      <View className="mt-6 mx-5 rounded-2xl bg-white overflow-hidden"> 
        <Image source={require("../assets/wedsnap-banner.png")} className="w-full h-40" /> 
      </View>

      {/* ACTION BUTTONS */}
      <View className="flex-row gap-4 px-5 mt-6">

        {/* JOIN / SWITCH */}
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
              {hasWedding
                ? "Change active event"
                : "Enter invite code"}
            </Text>

          </View>
        </Pressable>

        {/* CREATE */}
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

      {/* ================= JOIN MODAL ================= */}
      <Modal visible={joinModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-5 rounded-t-2xl">

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
        </View>
      </Modal>

      {/* ================= CREATE MODAL ================= */}
      <Modal visible={createModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-5 rounded-t-2xl gap-3">

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
              <Text className="text-white text-center">
                Create Wedding
              </Text>
            </Pressable>

            <Pressable onPress={() => setCreateModal(false)}>
              <Text className="text-center mt-3">Cancel</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
};

export default Dashboard;