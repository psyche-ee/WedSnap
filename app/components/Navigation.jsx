import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

const Navigation = ({ weddingId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route) => pathname.startsWith(route);

  const NavItem = ({ route, icon, center = false }) => {
    const active = isActive(route);

    const handlePress = () => {
      if (weddingId) {
        router.push(`${route}?weddingId=${weddingId}`);
      } else {
        router.push(route);
      }
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`justify-center items-center rounded-full ${
          center
            ? "w-[65px] h-[65px] -mt-8"
            : "w-[50px] h-[50px]"
        }`}
        style={{
          backgroundColor: active || center ? "#7C5CFC" : "#F1F0FF",

          ...(active || center
            ? {
                shadowColor: "#7C5CFC",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
              }
            : {}),
        }}
      >
        <Ionicons
          name={icon}
          size={center ? 28 : 22}
          color={active || center ? "#fff" : "#7C5CFC"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="absolute bottom-5 left-5 right-5 flex-row justify-between items-center px-4 py-3 rounded-full"
      style={{
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      {/* Home */}
      <NavItem route="/home" icon="home" />

      {/* Guests */}
      <NavItem route="/guests" icon="people" />

      {/* Wedding Entry (center) */}
      <NavItem
        route="/weddingEntry"
        icon="add"
        center={true}
      />

      {/* About */}
      <NavItem route="/about" icon="information-circle" />

      {/* Settings */}
      <NavItem route="/settings" icon="settings" />
    </View>
  );
};

export default Navigation;