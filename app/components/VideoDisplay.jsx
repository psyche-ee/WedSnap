import { View, Text, Image } from "react-native";

const VideoDisplay = () => {
  return (
    <View className="gap-2.5">
      <Text className="text-[18px] font-semibold">Videos</Text>

      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            className="w-[48%] h-[120px] bg-[#D9D9D9] rounded-[15px] mb-2.5 justify-center items-center"
          >
            <Image
              source={require("../../assets/videoPlaceholder.png")}
              className="w-[40px] h-[40px] opacity-40"
            />
          </View>
        ))}
      </View>

      <Text className="self-end text-[#333]">more</Text>
    </View>
  );
};

export default VideoDisplay;