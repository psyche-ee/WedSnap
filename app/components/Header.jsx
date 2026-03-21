import { Image, Text, View } from "react-native";

const Header = () => {
  return (
    <View>
      <View className="mb-5 flex-row items-center justify-center">
        <Image
          source={require("../../assets/logo.png")}
          className="w-[100px] h-[100px]"
        />
        <Text
          className="text-[36px]"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          WedSnap
        </Text>
      </View>
      <Text
        className="text-center text-[18px]"
        style={{ fontFamily: "Poppins_400Regular" }}
      >
        Capture and share wedding {"\n"} memories together.
      </Text>
    </View>
  );
};

export default Header;
