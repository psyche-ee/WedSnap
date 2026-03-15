import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Navigation = () => {
  return (
    <View className="absolute bottom-5 left-5 right-5 flex-row justify-around items-center bg-white py-3 rounded-full shadow-lg">

      <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-[#F3F0FA] justify-center items-center">
        <Ionicons name="home" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-[#F3F0FA] justify-center items-center">
        <Ionicons name="images" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity className="w-[60px] h-[60px] rounded-full bg-[#6A4C93] justify-center items-center -mt-6 shadow-lg">
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-[#F3F0FA] justify-center items-center">
        <Ionicons name="settings" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-[#F3F0FA] justify-center items-center">
        <Ionicons name="person" size={24} color="#6A4C93" />
      </TouchableOpacity>

    </View>
  );
};

export default Navigation;