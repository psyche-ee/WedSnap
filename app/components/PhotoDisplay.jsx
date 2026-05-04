import { View, Text, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import { useWedding } from "../../context/WeddingContext";

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
            photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.url }}
                className="w-[30%] h-[90px] rounded-[15px] mb-2.5"
              />
            ))
          ) : (
            <Text className="text-[#777]">
              No photos yet.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PhotoDisplay;