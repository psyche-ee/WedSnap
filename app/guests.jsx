import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Guests() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const { weddingId } = useLocalSearchParams();

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH GUESTS FROM FIRESTORE
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        if (!weddingId) return;

        // 1. Get wedding
        const weddingRef = doc(db, "weddings", weddingId);
        const weddingSnap = await getDoc(weddingRef);

        if (!weddingSnap.exists()) return;

        const weddingData = weddingSnap.data();
        const participantIds = weddingData.participants || [];

        // include owner too
        if (!participantIds.includes(weddingData.userId)) {
          participantIds.push(weddingData.userId);
        }

        // 2. Fetch users
        const usersData = await Promise.all(
          participantIds.map(async (uid) => {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              return {
                id: uid,
                name: userSnap.data().name || "User",
                role:
                  uid === weddingData.userId
                    ? "Organizer"
                    : "Guest",
              };
            }
          })
        );

        setGuests(usersData.filter(Boolean));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [weddingId]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 pb-24 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="mt-5">
          <Text
            className="text-[26px]"
            style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
          >
            Guests
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ fontFamily: "Poppins_400Regular", color: "#777" }}
          >
            See who’s attending the wedding
          </Text>
        </View>

        {/* LOADING */}
        {loading && (
          <ActivityIndicator size="large" color="#7C5CFC" />
        )}

        {/* GUEST LIST */}
        {!loading && (
          <View className="gap-4 mt-3">
            {guests.map((guest) => (
              <View
                key={guest.id}
                className="flex-row items-center bg-white rounded-2xl p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                {/* INITIAL AVATAR */}
                <View className="w-[50px] h-[50px] rounded-full bg-[#EDE9FF] justify-center items-center">
                  <Text
                    className="text-lg"
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#7C5CFC",
                    }}
                  >
                    {guest.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* NAME + ROLE */}
                <View className="ml-4 flex-1">
                  <Text
                    className="text-lg"
                    style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
                  >
                    {guest.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      color: "#888",
                    }}
                  >
                    {guest.role}
                  </Text>
                </View>

                {/* STATUS BADGE */}
                <View className="bg-[#7C5CFC] px-3 py-1 rounded-full">
                  <Text
                    className="text-white text-xs"
                    style={{ fontFamily: "Poppins_400Regular" }}
                  >
                    Attending
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Developers />
      </ScrollView>

      <Navigation weddingId={weddingId} />
    </SafeAreaView>
  );
}