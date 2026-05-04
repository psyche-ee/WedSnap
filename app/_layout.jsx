import { Stack } from "expo-router";
import "../global.css";

import { WeddingProvider } from "../context/WeddingContext";

const RootLayout = () => {
  return (
    <WeddingProvider>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </WeddingProvider>
  );
};

export default RootLayout;