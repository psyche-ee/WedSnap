import { View, Text, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { useWedding } from "../../context/WeddingContext";

import { db, auth } from "../../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert, Pressable } from "react-native";

const PhotoDisplay = () => {
  const { weddingId } = useWedding();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "weddings", weddingId, "media"),
      orderBy("createdAt", "desc")
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
      }
    );

    return unsubscribe;
  }, [weddingId]);

  const handleDelete = (photoId, uploadedBy) => {
    const user = auth.currentUser;

    if (!user) return;

    if (user.uid !== uploadedBy) {
      Alert.alert("Denied", "You can only delete your own photos.");
      return;
    }

    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "weddings", weddingId, "media", photoId)
              );

              Alert.alert("Deleted", "Photo removed successfully.");
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Failed to delete photo.");
            }
          },
        },
      ]
    );
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
                  <Image
                    source={{ uri: photo.url }}
                    className="w-full h-[90px] rounded-[15px]"
                  />

                  {canDelete && (
                    <Pressable
                      onPress={() =>
                        handleDelete(photo.id, photo.uploadedBy)
                      }
                      className="absolute top-1 right-1 bg-red-500 rounded-full px-2 py-1"
                    >
                      <Text className="text-white text-[10px]">
                        Delete
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })
          ) : (
            <Text className="text-[#777]">No photos yet.</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PhotoDisplay;