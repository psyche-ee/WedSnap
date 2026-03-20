import { View, Text } from "react-native";

export default function Developers({ fixed = false }) {
  return (
    <View
      className={`w-full items-center ${
        fixed ? "absolute bottom-5" : "mb-12"
      }`}
    >
      <Text className="text-sm text-gray-500">
        Developed by
        <Text className="font-bold"> Kent Buno</Text> and
        <Text className="font-bold"> Eduardo Belda</Text>
      </Text>
    </View>
  );
}