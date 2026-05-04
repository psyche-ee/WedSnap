import { View, Text, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { Video } from "expo-av";

import { db } from "../../lib/firebase";
import { useWedding } from "../../context/WeddingContext";

const VideoDisplay = () => {
  const { weddingId } = useWedding();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) {
      setVideos([]);
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
          .filter((item) => item.type === "video");

        setVideos(media);
        setLoading(false);
      },
      (error) => {
        console.log("Video fetch error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [weddingId]);

  return (
    <View className="gap-2.5">
      <Text className="text-[18px] font-semibold">
        Videos ({videos.length})
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : videos.length > 0 ? (
        <View className="flex-row flex-wrap justify-between">
          {videos.map((video) => (
            <Video
              key={video.id}
              source={{ uri: video.url }}
              className="w-[48%] h-[120px] rounded-[15px] mb-2.5"
              useNativeControls
              resizeMode="cover"
            />
          ))}
        </View>
      ) : (
        <View className="bg-[#EFEAFE] rounded-[20px] p-6 items-center">
          <Image
            source={require("../../assets/videoPlaceholder.png")}
            className="w-[40px] h-[40px] opacity-40 mb-3"
          />

          <Text className="text-[#333] font-semibold">
            No videos yet
          </Text>

          <Text className="text-[#777] text-center mt-1">
            Capture or upload wedding moments here.
          </Text>
        </View>
      )}
    </View>
  );
};

export default VideoDisplay;