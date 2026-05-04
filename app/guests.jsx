import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navigation from "./components/Navigation";
import Developers from "./components/Developers";

export default function Guests() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [ownedWeddings, setOwnedWeddings] = useState([]);
  const [joinedWeddings, setJoinedWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    let unsub = () => {};

    unsub = onAuthStateChanged(auth, (user) => {
      const uid = user ? user.uid : null;
      setCurrentUid(uid);

      const fetchWeddingsForUid = async (uid) => {
        setLoading(true);
        try {
          if (!uid) {
            setOwnedWeddings([]);
            setJoinedWeddings([]);
            setLoading(false);
            return;
          }

          const normalizedUid = String(uid).trim();

          // Manual fetch: read all weddings and keep the ones user owns or joined via participants array.
          const weddingsSnap = await getDocs(collection(db, "weddings"));
          const allDocs = weddingsSnap.docs.filter((wDoc) => {
            const wData = wDoc.data();
            const ownerId = wData.userId ? String(wData.userId).trim() : "";
            const participants = Array.isArray(wData.participants)
              ? wData.participants.map((id) => String(id).trim())
              : [];
            return (
              ownerId === normalizedUid || participants.includes(normalizedUid)
            );
          });
          const map = new Map();

          for (const d of allDocs) {
            const wid = d.id;
            if (map.has(wid)) continue;
            const data = d.data();
            const participantIds = Array.isArray(data.participants)
              ? [...new Set(data.participants.map((id) => String(id).trim()))]
              : [];

            // Ensure owner is included
            const normalizedOwnerId = data.userId
              ? String(data.userId).trim()
              : "";
            if (
              normalizedOwnerId &&
              !participantIds.includes(normalizedOwnerId)
            ) {
              participantIds.push(normalizedOwnerId);
            }

            const coOrganizerIds = Array.isArray(data.coOrganizers)
              ? data.coOrganizers.map((id) => String(id).trim())
              : [];
            const organizerId = normalizedOwnerId;

            // Fetch each participant's user data - simple loop
            const users = [];
            for (const puid of participantIds) {
              try {
                const userRef = doc(db, "users", puid);
                const userSnap = await getDoc(userRef);
                const u = userSnap.exists() ? userSnap.data() : {};
                let role = "Guest";
                if (puid === organizerId) role = "Organizer";
                else if (coOrganizerIds.includes(puid)) role = "Co-Organizer";

                users.push({
                  id: puid,
                  name: String(u.name || u.displayName || "").trim(),
                  email: String(u.email || "").trim(),
                  role,
                  roleColor:
                    role === "Organizer"
                      ? "#D4AF37"
                      : role === "Co-Organizer"
                        ? "#9C27B0"
                        : "#7C5CFC",
                  bgColor:
                    role === "Organizer"
                      ? "#FFF8E1"
                      : role === "Co-Organizer"
                        ? "#F3E5F5"
                        : "#EDE9FF",
                });
              } catch (e) {
                console.log(`Error fetching user ${puid}:`, e);
              }
            }

            const filtered = users.filter(Boolean);

            console.log(
              `Guests.jsx: wedding ${wid} participantsCount=${participantIds.length} includesUid=${participantIds.includes(String(uid).trim())}`,
              participantIds,
            );

            map.set(wid, {
              id: wid,
              spouseName: (data.spouseName || "Wedding").trim(),
              location: (data.location || "").trim(),
              dateTime: data.dateTime,
              organizers: filtered.filter((x) => x.role === "Organizer"),
              coOrganizers: filtered.filter((x) => x.role === "Co-Organizer"),
              guests: filtered.filter((x) => x.role === "Guest"),
              isOwner: organizerId === String(uid).trim(),
            });
          }

          const all = Array.from(map.values());
          setOwnedWeddings(all.filter((w) => w.isOwner));
          setJoinedWeddings(all.filter((w) => !w.isOwner));
        } catch (err) {
          console.log("Guests.jsx fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchWeddingsForUid(uid);
    });

    return () => unsub();
  }, []);

  if (!fontsLoaded) return null;

  const GuestCard = ({ guest }) => (
    <View
      className="flex-row items-center bg-white rounded-2xl p-4 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        className="w-[50px] h-[50px] rounded-full justify-center items-center"
        style={{ backgroundColor: guest.bgColor }}
      >
        <Text
          className="text-lg"
          style={{ fontFamily: "Poppins_500Medium", color: guest.roleColor }}
        >
          {(guest.name || guest.id).charAt(0).toUpperCase()}
        </Text>
      </View>

      <View className="ml-4 flex-1">
        <Text
          className="text-base"
          style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
        >
          {guest.name || guest.id}
        </Text>
        {guest.email ? (
          <Text
            className="text-xs mt-0.5"
            style={{ fontFamily: "Poppins_400Regular", color: "#999" }}
          >
            {guest.email}
          </Text>
        ) : !guest.name ? (
          <Text
            className="text-xs mt-0.5"
            style={{ fontFamily: "Poppins_400Regular", color: "#999" }}
          >
            No profile data in users collection
          </Text>
        ) : null}
      </View>

      <View
        className="px-3 py-1 rounded-full flex-row items-center gap-1"
        style={{ backgroundColor: guest.bgColor }}
      >
        <Ionicons name="checkmark-circle" size={14} color={guest.roleColor} />
        <Text
          className="text-xs"
          style={{ fontFamily: "Poppins_400Regular", color: guest.roleColor }}
        >
          {guest.role}
        </Text>
      </View>
    </View>
  );

  const SectionHeader = ({ title, count, icon, color }) => (
    <View className="flex-row items-center gap-3 mt-6 mb-3">
      <View
        className="w-10 h-10 rounded-full justify-center items-center"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View>
        <Text
          className="text-lg"
          style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
        >
          {title}
        </Text>
        <Text
          className="text-xs"
          style={{ fontFamily: "Poppins_400Regular", color: "#999" }}
        >
          {count} {count === 1 ? "person" : "people"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      <ScrollView
        contentContainerClassName="px-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-5 mb-2">
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
            Your weddings and weddings you joined
          </Text>
        </View>

        {loading && (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#7C5CFC" />
          </View>
        )}

        {!loading && (
          <>
            {/* OWNED WEDDINGS */}
            {ownedWeddings.length > 0 && (
              <View>
                <Text
                  className="text-lg mt-3"
                  style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
                >
                  Your Weddings
                </Text>
                {ownedWeddings.map((w) => (
                  <View key={w.id} className="mt-4">
                    <View className="bg-white p-3 rounded-2xl">
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          color: "#333",
                        }}
                      >
                        {w.spouseName}
                      </Text>
                      {w.location ? (
                        <Text
                          style={{
                            fontFamily: "Poppins_400Regular",
                            color: "#777",
                            fontSize: 12,
                          }}
                        >
                          📍 {w.location}
                        </Text>
                      ) : null}
                    </View>

                    {w.organizers.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Organizers"
                          count={w.organizers.length}
                          icon="star"
                          color="#D4AF37"
                        />
                        {w.organizers.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}

                    {w.coOrganizers.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Co-Organizers"
                          count={w.coOrganizers.length}
                          icon="people"
                          color="#9C27B0"
                        />
                        {w.coOrganizers.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}

                    {w.guests.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Guests"
                          count={w.guests.length}
                          icon="person"
                          color="#7C5CFC"
                        />
                        {w.guests.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* JOINED WEDDINGS */}
            {joinedWeddings.length > 0 && (
              <View>
                <Text
                  className="text-lg mt-6"
                  style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
                >
                  Weddings You Joined
                </Text>
                {joinedWeddings.map((w) => (
                  <View key={w.id} className="mt-4">
                    <View className="bg-white p-3 rounded-2xl">
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          color: "#333",
                        }}
                      >
                        {w.spouseName}
                      </Text>
                      {w.location ? (
                        <Text
                          style={{
                            fontFamily: "Poppins_400Regular",
                            color: "#777",
                            fontSize: 12,
                          }}
                        >
                          📍 {w.location}
                        </Text>
                      ) : null}
                    </View>

                    {w.organizers.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Organizers"
                          count={w.organizers.length}
                          icon="star"
                          color="#D4AF37"
                        />
                        {w.organizers.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}

                    {w.coOrganizers.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Co-Organizers"
                          count={w.coOrganizers.length}
                          icon="people"
                          color="#9C27B0"
                        />
                        {w.coOrganizers.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}

                    {w.guests.length > 0 && (
                      <View>
                        <SectionHeader
                          title="Guests"
                          count={w.guests.length}
                          icon="person"
                          color="#7C5CFC"
                        />
                        {w.guests.map((g) => (
                          <GuestCard key={g.id} guest={g} />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* EMPTY STATE */}
            {ownedWeddings.length === 0 && joinedWeddings.length === 0 && (
              <View className="mt-10 items-center gap-3">
                <Ionicons name="people-outline" size={48} color="#DDD" />
                <Text
                  style={{ fontFamily: "Poppins_400Regular", color: "#999" }}
                >
                  No weddings found
                </Text>
              </View>
            )}
          </>
        )}

        <Developers />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
}
