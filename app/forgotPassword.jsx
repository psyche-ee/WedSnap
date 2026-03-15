import { Text, TextInput, View, Image, Pressable } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";

const ForgotPassword = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 bg-[#E4DFFD]">
      
      <View className="flex-row items-center justify-center gap-2.5">
        <Image
          source={require("../assets/logo.png")}
          className="w-[100px] h-[100px]"
        />
        <Text
          className="text-[36px]"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          WedSnap
        </Text>
      </View>

      <View className="items-center bg-white p-5 rounded-[10px] w-[80%] gap-2.5">
        <Text
          className="text-[24px] mb-2.5"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          Forgot Password
        </Text>

        <View className="w-full">
          <Text
            className="text-[16px]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Email
          </Text>

          <TextInput
            placeholder="Email"
            className="bg-[#EEEEFB] py-2.5 px-4 rounded-lg w-full text-[16px] border border-[#D9D9D9]"
            style={{ fontFamily: "Poppins_400Regular" }}
          />
        </View>

        <View className="flex-row gap-2.5 w-[80%] items-center justify-center">
          <Link href="/login" asChild>
            <Pressable className="border border-[#D9D9D9] py-3.5 px-5 rounded-[10px] items-center my-2.5">
              <Text
                className="text-[#6A4C93]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Cancel
              </Text>
            </Pressable>
          </Link>

          <Link href="/dashboard" asChild>
            <Pressable className="bg-[#6A4C93] py-3.5 px-5 rounded-[10px] items-center my-2.5">
              <Text
                className="text-white"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Send Code
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

    </View>
  );
};

export default ForgotPassword;