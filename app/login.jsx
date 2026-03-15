import { Text, TextInput, View, Image, Pressable } from "react-native";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { Link } from "expo-router";

const Login = () => {
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
          Login
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

        <View className="w-full">
          <Text
            className="text-[16px]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Password
          </Text>

          <TextInput
            placeholder="Password"
            className="bg-[#EEEEFB] py-2.5 px-4 rounded-lg w-full text-[16px] border border-[#D9D9D9]"
            style={{ fontFamily: "Poppins_400Regular" }}
          />
        </View>

        <Link href="/forgotPassword" className="text-[14px] text-[#B3B3B3] self-start">
          Forgot password?
        </Link>

        <Link href="/dashboard" asChild>
          <Pressable className="bg-[#6A4C93] py-3.5 rounded-[10px] items-center w-full my-2.5">
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Login
            </Text>
          </Pressable>
        </Link>

        <Link href="/signup">
          <Text
            className="text-[14px] text-[#B3B3B3]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Don’t have an account?{" "}
            <Text
              className="text-[#6A4C93]"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Register here.
            </Text>
          </Text>
        </Link>
      </View>

    </View>
  );
};

export default Login;