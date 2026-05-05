import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { signOut } from "firebase/auth";

import { auth } from "../lib/firebase";

import Navigation from "./components/Navigation";

import { useWedding } from "../context/WeddingContext";

import { useRef, useState } from "react";

export default function Settings() {
  const user = auth.currentUser;

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const router = useRouter();

  const { resetWedding } = useWedding();

  // 🔥 ANIMATION VALUES
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacityAnim = useRef(
    new Animated.Value(0)
  ).current;
  const spinnerRotateAnim = useRef(
    new Animated.Value(0)
  ).current;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!fontsLoaded) return null;

  const toPascalCase = (value) =>
    String(value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");

  const displayName = toPascalCase(
    user?.displayName || "User"
  );

  const email = user?.email || "No email";

  const userInitial =
    displayName.charAt(0).toUpperCase();

  // 🔥 Start spinner animation
  const startSpinner = () => {
    Animated.loop(
      Animated.timing(spinnerRotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      startSpinner();

      // 🔥 Show overlay and fade out content
      Animated.parallel([
        Animated.timing(overlayOpacityAnim, {
          toValue: 0.6,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        // Perform logout
        resetWedding();
        await signOut(auth);
        router.replace("/auth/login");
      });
    } catch (error) {
      // Reset animations on error
      setIsLoggingOut(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        "Error",
        "Failed to log out. Please try again."
      );
    }
  };

  const SettingItem = ({
    icon,
    title,
    danger = false,
    onPress,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 flex-row items-center justify-between"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        <View
          className="w-11 h-11 rounded-full justify-center items-center"
          style={{
            backgroundColor: danger
              ? "#FFF1F2"
              : "#F2EEFF",
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              danger ? "#DC2626" : "#7C5CFC"
            }
          />
        </View>

        <Text
          className="ml-4"
          style={{
            fontFamily: "Poppins_400Regular",
            color: danger ? "#DC2626" : "#333",
          }}
        >
          {title}
        </Text>
      </View>

      {!danger && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#999"
        />
      )}
    </TouchableOpacity>
  );

  const spinRotate = spinnerRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F5FF]">
      {/* 🔥 OVERLAY */}
      <Animated.View
        pointerEvents={isLoggingOut ? "auto" : "none"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#1a1a1a",
          opacity: overlayOpacityAnim,
          zIndex: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 🔥 SPINNER */}
        {isLoggingOut && (
          <Animated.View
            style={{
              transform: [{ rotate: spinRotate }],
            }}
          >
            <Ionicons
              name="refresh-circle"
              size={48}
              color="#fff"
            />
          </Animated.View>
        )}
      </Animated.View>

      {/* 🔥 MAIN CONTENT */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
        }}
      >
        <ScrollView
          contentContainerClassName="px-5 pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mt-5 mb-4">
            <Text
              className="text-[26px]"
              style={{
                fontFamily: "Poppins_500Medium",
                color: "#333",
              }}
            >
              Settings
            </Text>

            <Text
              className="text-sm mt-1"
              style={{
                fontFamily:
                  "Poppins_400Regular",
                color: "#777",
              }}
            >
              Manage your account preferences
            </Text>
          </View>

          {/* Profile Card */}
          <View
            className="bg-white rounded-3xl p-6 items-center mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              className="w-[90px] h-[90px] rounded-full justify-center items-center mb-4"
              style={{
                backgroundColor: "#F2EEFF",
              }}
            >
              <Text
                className="text-[34px]"
                style={{
                  fontFamily:
                    "Poppins_500Medium",
                  color: "#7C5CFC",
                }}
              >
                {userInitial}
              </Text>
            </View>

            <Text
              className="text-lg"
              style={{
                fontFamily:
                  "Poppins_500Medium",
                color: "#333",
              }}
            >
              {displayName}
            </Text>

            <Text
              className="text-sm mt-1"
              style={{
                fontFamily:
                  "Poppins_400Regular",
                color: "#777",
              }}
            >
              {email}
            </Text>
          </View>

          {/* Options */}
          <View className="gap-3">
            <SettingItem
              icon="person"
              title="Edit Profile"
              onPress={() =>
                router.push("/edit_profile")
              }
            />

            <SettingItem
              icon="lock-closed"
              title="Change Password"
              onPress={() =>
                router.push(
                  "/change_password"
                )
              }
            />

            <SettingItem
              icon="log-out"
              title="Log Out"
              danger
              onPress={handleLogout}
            />
          </View>
        </ScrollView>

        <Navigation />
      </Animated.View>
    </SafeAreaView>
  );
}