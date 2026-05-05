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
} from "react-native";
import { useEffect, useState } from "react";

import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import { useWedding } from "../../context/WeddingContext";

import { db, auth } from "../../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

const PhotoDisplay = () => {
  const { weddingId } = useWedding();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState(null);

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
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.type === "image");

        setPhotos(media);
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
        <View className="flex-row flex-wrap justify-between">
          {photos.length > 0 ? (
            photos.map((photo) => {
              const user = auth.currentUser;
              const canDelete = user && user.uid === photo.uploadedBy;

              return (
                <View key={photo.id} className="w-[30%] mb-2.5 relative">
                  <Pressable onPress={() => handleOpenPhoto(photo)}>
                    <Image
                      source={{ uri: photo.url }}
                      className="w-full h-[90px] rounded-[15px]"
                    />
                  </Pressable>

                  {canDelete && (
                    <Pressable
                      onPress={() => handleDelete(photo.id, photo.uploadedBy)}
                      className="absolute top-1 right-1 bg-red-500 rounded-full px-2 py-1"
                    >
                      <Text className="text-white text-[10px]">Delete</Text>
                    </Pressable>
                  )}
                </View>
              );
            })
          ) : (
            <View className="w-full items-center justify-center py-10">
              {/* ICON */}
              <View className="bg-[#EFEAFE] p-6 rounded-full mb-4">
                <Image
                  source={require("../../assets/photoPlaceholder.png")}
                  className="w-[50px] h-[50px] opacity-50"
                />
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
