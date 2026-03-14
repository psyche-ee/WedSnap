import {
  Image,
  Text,
  View,
  Platform,
  PlatformColor,
  Pressable,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";

const Create = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showIOSTimeModal, setShowIOSTimeModal] = useState(false);
  const [spouseName, setSpouseName] = useState("");
  const [location, setLocation] = useState("");

  const onChangeDate = (event, selectedDate) => {
    if (event?.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (event?.type === "set" && selectedTime) {
      setTime(selectedTime);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        is24Hour: true,
        onChange: onChangeDate,
      });
      return;
    }
    setShowIOSModal(true);
  };

  const openTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: time,
        mode: "time",
        is24Hour: false,
        onChange: onChangeTime,
      });
      return;
    }
    setShowIOSTimeModal(true);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#E4DFFD]">
      <View className="mt-5 mb-10 items-center">
        <Image source={require("../assets/logo.png")} />
        <Text
          className="text-[28px]"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          Wedding Form
        </Text>
      </View>

      <Text
        className="mx-[30px] mb-1.5 text-base"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        Wedding Date
      </Text>
      <Pressable
        className="mx-[30px] mb-3 flex-row items-center gap-2 rounded-[10px] bg-white p-4"
        onPress={openDatePicker}
      >
        <Image source={require("../assets/calendar.png")} />
        <Text
          className="text-base text-[#333]"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Pressable>

      <Text
        className="mx-[30px] mb-1.5 text-base"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        Wedding Time
      </Text>
      <Pressable
        className="mx-[30px] mb-3 flex-row items-center gap-2 rounded-[10px] bg-white p-4"
        onPress={openTimePicker}
      >
        <Image source={require("../assets/watch.png")} />
        <Text
          className="text-base text-[#333]"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          {time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
      </Pressable>

      <Text
        className="mx-[30px] mb-1.5 text-base"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        Spouse Name
      </Text>
      <View className="mx-[30px] mb-3 flex-row items-center gap-2 rounded-[10px] bg-white p-4">
        <Image source={require("../assets/person.png")} />
        <TextInput
          className="flex-1 text-base text-[#333]"
          style={{ fontFamily: "Poppins_400Regular" }}
          placeholder="Enter spouse name"
          placeholderTextColor="#999"
          value={spouseName}
          onChangeText={setSpouseName}
        />
      </View>

      <Text
        className="mx-[30px] mb-1.5 text-base"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        Location
      </Text>
      <View className="mx-[30px] mb-3 flex-row items-center gap-2 rounded-[10px] bg-white p-4">
        <Image source={require("../assets/location.png")} />
        <TextInput
          className="flex-1 text-base text-[#333]"
          style={{ fontFamily: "Poppins_400Regular" }}
          placeholder="Enter location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <Pressable className="mx-[30px] mt-5 items-center rounded-[10px] bg-[#7C3AED] p-4">
        <Text
          className="text-base text-white"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          Create
        </Text>
      </Pressable>

      {Platform.OS === "ios" && (
        <>
          <Modal visible={showIOSModal} transparent animationType="slide">
            <View className="flex-1 justify-end bg-[rgba(0,0,0,0.25)]">
              <View
                className="items-center rounded-tl-xl rounded-tr-xl p-3"
                style={{
                  backgroundColor: PlatformColor("secondarySystemBackground"),
                }}
              >
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onChangeDate}
                />
                <Button title="Done" onPress={() => setShowIOSModal(false)} />
              </View>
            </View>
          </Modal>

          <Modal visible={showIOSTimeModal} transparent animationType="slide">
            <View className="flex-1 justify-end bg-[rgba(0,0,0,0.25)]">
              <View
                className="items-center rounded-tl-xl rounded-tr-xl p-3"
                style={{
                  backgroundColor: PlatformColor("secondarySystemBackground"),
                }}
              >
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="spinner"
                  onChange={onChangeTime}
                />
                <Button
                  title="Done"
                  onPress={() => setShowIOSTimeModal(false)}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
};

export default Create;
