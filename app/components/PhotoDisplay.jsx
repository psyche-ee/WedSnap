import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { useEffect, useState, useRef } from "react";

import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

import { useWedding } from "../../context/WeddingContext";

import { db, auth } from "../../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

const toPascalCase = (value) =>
  String(value || "")
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

const PhotoDisplay = () => {
  const { weddingId } = useWedding();

  const [photos, setPhotos] = useState([]);
  const [photoGroups, setPhotoGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState(null);
  const [uploaderMap, setUploaderMap] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const rotationRefs = useRef({});

  const handleToggleGroup = (uploaderId) => {
    setCollapsedGroups((prev) => {
      const newVal = !prev[uploaderId];
      const next = { ...prev, [uploaderId]: newVal };

      if (!rotationRefs.current[uploaderId]) {
        rotationRefs.current[uploaderId] = new Animated.Value(newVal ? 0 : 1);
      }

      const toValue = newVal ? 0 : 1;
      Animated.timing(rotationRefs.current[uploaderId], {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }).start();

      return next;
    });
  };

  useEffect(() => {
    if (!weddingId) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "weddings", weddingId, "media"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const media = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.type === "image");

        setPhotos(media);

        // build groups by uploader
        const groups = {};
        const uploaderIds = new Set();
        media.forEach((m) => {
          const uid = m.uploadedBy || "unknown";
          uploaderIds.add(uid);
          if (!groups[uid]) groups[uid] = [];
          groups[uid].push(m);
        });

        const groupArray = Object.keys(groups).map((uid) => ({
          uploaderId: uid,
          photos: groups[uid],
        }));

        setPhotoGroups(groupArray);

        // fetch uploader display names (best-effort)
        const fetchUploaderNames = async () => {
          const map = {};

          await Promise.all(
            Array.from(uploaderIds).map(async (uid) => {
              try {
                if (uid === "unknown") {
                  map[uid] = toPascalCase("Unknown");
                  return;
                }

                // try to read user doc from Firestore users collection
                const uSnap = await getDoc(doc(db, "users", uid));
                if (uSnap && uSnap.exists && uSnap.exists()) {
                  const data = uSnap.data();
                  // prefer common name fields
                  const name =
                    data.displayName ||
                    data.name ||
                    (data.firstName && data.lastName
                      ? `${data.firstName} ${data.lastName}`
                      : null);
                  map[uid] = toPascalCase(name || data.username || uid);
                  return;
                }

                // fallback to any uploader name embedded in the media doc
                const fromMedia = media.find(
                  (m) => (m.uploadedBy || "unknown") === uid,
                );
                if (fromMedia) {
                  map[uid] = toPascalCase(fromMedia.uploadedByName || uid);
                  return;
                }

                map[uid] = toPascalCase(uid);
              } catch (e) {
                // ignore and fallback below
              }
            }),
          );

          // final fallback: ensure every uid has a value
          media.forEach((m) => {
            const uid = m.uploadedBy || "unknown";
            if (!map[uid]) map[uid] = toPascalCase(m.uploadedByName || uid);
          });

          setUploaderMap(map);
        };

        fetchUploaderNames();

        setLoading(false);
      },
      (error) => {
        console.log("Photo fetch error:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [weddingId]);

  const getFileExtension = (url) => {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);

    return match?.[1] || "jpg";
  };

  const handleOpenPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleDownloadPhoto = async (photo) => {
    try {
      if (Platform.OS === "web") {
        Alert.alert(
          "Download unavailable",
          "Please open the image in a new tab and save it from your browser.",
        );
        return;
      }

      setDownloadingPhotoId(photo.id);

      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Allow access to your photo library to save this image.",
        );
        return;
      }

      const extension = getFileExtension(photo.url);
      const fileUri = `${FileSystem.documentDirectory}wedsnap-${photo.id}.${extension}`;
      const downloadedFile = await FileSystem.downloadAsync(photo.url, fileUri);

      await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);

      Alert.alert("Saved", "Photo downloaded to your library.");
    } catch (error) {
      console.log("Download photo error:", error);
      Alert.alert("Download failed", "Could not save the photo.");
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const handleDelete = (photoId, uploadedBy) => {
    const user = auth.currentUser;

    if (!user) return;

    if (user.uid !== uploadedBy) {
      Alert.alert("Denied", "You can only delete your own photos.");
      return;
    }

    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "weddings", weddingId, "media", photoId));

            Alert.alert("Deleted", "Photo removed successfully.");
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to delete photo.");
          }
        },
      },
    ]);
  };

  return (
    <View className="gap-2.5">
      <Text className="text-[18px] font-semibold">
        Photos ({photos.length})
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {photoGroups.length > 0 ? (
            photoGroups.map((group) => {
              const uploaderId = group.uploaderId;
              const uploaderName =
                uploaderMap[uploaderId] ||
                (uploaderId === "unknown" ? "Unknown" : uploaderId);
              const collapsed = !!collapsedGroups[uploaderId];

              return (
                <View key={uploaderId} className="mb-4">
                  <Pressable
                    onPress={() => handleToggleGroup(uploaderId)}
                    className="flex-row items-center justify-between mb-3"
                  >
                    <Text
                      style={{ fontFamily: "Poppins_500Medium", color: "#333" }}
                    >
                      {uploaderName}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          color: "#777",
                          marginRight: 6,
                        }}
                      >
                        {group.photos.length}{" "}
                        {group.photos.length === 1 ? "photo" : "photos"}
                      </Text>
                      {(() => {
                        if (!rotationRefs.current[uploaderId]) {
                          rotationRefs.current[uploaderId] = new Animated.Value(
                            collapsed ? 0 : 1,
                          );
                        }

                        const rotate = rotationRefs.current[
                          uploaderId
                        ].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "180deg"],
                        });

                        return (
                          <AnimatedIcon
                            name="chevron-down"
                            size={18}
                            color="#777"
                            style={{ transform: [{ rotate }] }}
                          />
                        );
                      })()}
                    </View>
                  </Pressable>

                  {!collapsed && (
                    <View className="flex-row flex-wrap justify-between">
                      {group.photos.map((photo, idx) => {
                        const user = auth.currentUser;
                        const canDelete = user && user.uid === photo.uploadedBy;

                        // responsive widths: 100% for 1, 48% for 2, 32% for 3+
                        const count = group.photos.length;
                        const widthStyle =
                          count === 1
                            ? { width: "100%" }
                            : count === 2
                              ? { width: "48%" }
                              : { width: "32%" };

                        return (
                          <View
                            key={photo.id}
                            style={{ ...widthStyle, marginBottom: 10 }}
                          >
                            <Pressable onPress={() => handleOpenPhoto(photo)}>
                              <Image
                                source={{ uri: photo.url }}
                                style={{
                                  width: "100%",
                                  height: 110,
                                  borderRadius: 15,
                                }}
                              />
                            </Pressable>

                            {canDelete && (
                              <Pressable
                                onPress={() =>
                                  handleDelete(photo.id, photo.uploadedBy)
                                }
                                style={{
                                  position: "absolute",
                                  right: 6,
                                  top: 6,
                                  backgroundColor: "#ef4444",
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 999,
                                }}
                              >
                                <Text style={{ color: "#fff", fontSize: 10 }}>
                                  Delete
                                </Text>
                              </Pressable>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className="w-full items-center justify-center py-10">
              {/* ICON */}
              <View className="bg-[#EFEAFE] p-6 rounded-full mb-4">
                <Ionicons name="images" size={32} color="#7C5CFC" />
              </View>

              {/* TITLE */}
              <Text className="text-[16px] font-semibold text-[#333]">
                No photos yet
              </Text>

              {/* SUBTEXT */}
              <Text className="text-[#777] text-center mt-2 px-10">
                Start capturing beautiful wedding moments. Photos you upload
                will appear here instantly.
              </Text>
            </View>
          )}
        </View>
      )}

      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={handleClosePhoto}
      >
        <View className="flex-1 bg-black/90">
          <View className="px-4 pt-12 pb-4 flex-row items-center justify-between">
            <Text className="text-white text-[16px] font-semibold">
              Photo Preview
            </Text>

            <Pressable
              onPress={handleClosePhoto}
              className="rounded-full bg-white/10 px-4 py-2"
            >
              <Text className="text-white text-[14px]">Close</Text>
            </Pressable>
          </View>

          {selectedPhoto && (
            <ScrollView
              className="flex-1"
              contentContainerClassName="flex-1 items-center justify-center px-4"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              maximumZoomScale={3}
              minimumZoomScale={1}
            >
              <Image
                source={{ uri: selectedPhoto.url }}
                className="w-full h-[70%] rounded-[20px]"
                resizeMode="contain"
              />
            </ScrollView>
          )}

          {selectedPhoto && (
            <View className="px-4 pb-8 pt-4 gap-3">
              <Pressable
                onPress={() => handleDownloadPhoto(selectedPhoto)}
                disabled={downloadingPhotoId === selectedPhoto.id}
                className="bg-[#7C5CFC] rounded-xl py-4 items-center"
              >
                <Text className="text-white text-[15px] font-semibold">
                  {downloadingPhotoId === selectedPhoto.id
                    ? "Downloading..."
                    : "Download Photo"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PhotoDisplay;
