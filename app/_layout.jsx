import { Stack } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
};

export default RootLayout;
