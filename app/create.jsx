import {
  Image,
  Text,
  View,
  Platform,
  Pressable,
  Modal,
  Button,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useRouter } from "expo-router";

import { auth, db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import Developers from "./components/Developers";

const Create = () => {
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showIOSTimeModal, setShowIOSTimeModal] = useState(false);
  const [spouseName, setSpouseName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    if (event?.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (event?.type === "set" && selectedTime) {
      setTime(selectedTime);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        onChange: onChangeDate,
      });
    } else {
      setShowIOSModal(true);
    }
  };

  const openTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: time,
        mode: "time",
        onChange: onChangeTime,
      });
    } else {
      setShowIOSTimeModal(true);
    }
  };

  // 🔥 CREATE WEDDING
  const handleCreate = async () => {
    if (!spouseName || !location) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      const dateTime = new Date(date);
      dateTime.setHours(time.getHours());
      dateTime.setMinutes(time.getMinutes());

      const inviteCode = generateCode(); // ⭐ NEW

      await addDoc(collection(db, "weddings"), {
        userId: user.uid,
        spouseName,
        location,
        dateTime,
        inviteCode, // ⭐ SAVE CODE
        participants: [user.uid], // creator auto joins
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", `Wedding created!\nCode: ${inviteCode}`);

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      {/* HEADER */}
      <View className="mt-5 mb-6 items-center">
        <Image source={require("../assets/wedsnap.png")} className="w-32 h-32" />
        <Text
          className="text-[26px]"
          style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
        >
          Create Wedding
        </Text>
      </View>

      {/* CARD */}
      <View className="mx-[20px] bg-white p-5 rounded-2xl gap-4 shadow-md">
        {/* DATE */}
        <Text style={{ fontFamily: "Poppins_500Medium", color: "#555" }}>
          Wedding Date
        </Text>
        <Pressable
          onPress={openDatePicker}
          className="flex-row items-center gap-3 bg-[#F1F0FF] p-4 rounded-xl border border-[#E4E1FF]"
        >
          <Image source={require("../assets/calendar.png")} />
          <Text style={{ fontFamily: "Poppins_400Regular" }}>
            {date.toLocaleDateString()}
          </Text>
        </Pressable>

        {/* TIME */}
        <Text style={{ fontFamily: "Poppins_500Medium", color: "#555" }}>
          Wedding Time
        </Text>
        <Pressable
          onPress={openTimePicker}
          className="flex-row items-center gap-3 bg-[#F1F0FF] p-4 rounded-xl border border-[#E4E1FF]"
        >
          <Image source={require("../assets/watch.png")} />
          <Text style={{ fontFamily: "Poppins_400Regular" }}>
            {time.toLocaleTimeString()}
          </Text>
        </Pressable>

        {/* SPOUSE */}
        <Text style={{ fontFamily: "Poppins_500Medium", color: "#555" }}>
          Spouse Name
        </Text>
        <TextInput
          placeholder="Enter spouse name"
          placeholderTextColor="#aaa"
          value={spouseName}
          onChangeText={setSpouseName}
          className="bg-[#F1F0FF] p-4 rounded-xl border border-[#E4E1FF]"
        />

        {/* LOCATION */}
        <Text style={{ fontFamily: "Poppins_500Medium", color: "#555" }}>
          Location
        </Text>
        <TextInput
          placeholder="Enter location"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
          className="bg-[#F1F0FF] p-4 rounded-xl border border-[#E4E1FF]"
        />

        {/* BUTTON */}
        <Pressable
          onPress={handleCreate}
          disabled={loading}
          className="bg-[#7C5CFC] p-4 rounded-xl items-center mt-3"
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {loading ? "Creating..." : "Create Wedding"}
          </Text>
        </Pressable>
      </View>

      {/* IOS PICKERS */}
      {Platform.OS === "ios" && (
        <>
          <Modal visible={showIOSModal} transparent animationType="slide">
            <View className="flex-1 justify-end bg-[rgba(0,0,0,0.25)]">
              <View className="bg-white p-3 rounded-t-xl">
                <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
                <Button title="Done" onPress={() => setShowIOSModal(false)} />
              </View>
            </View>
          </Modal>

          <Modal visible={showIOSTimeModal} transparent animationType="slide">
            <View className="flex-1 justify-end bg-[rgba(0,0,0,0.25)]">
              <View className="bg-white p-3 rounded-t-xl">
                <DateTimePicker value={time} mode="time" onChange={onChangeTime} />
                <Button title="Done" onPress={() => setShowIOSTimeModal(false)} />
              </View>
            </View>
          </Modal>
        </>
      )}

      <Developers fixed />
    </SafeAreaView>
  );
};

export default Create;