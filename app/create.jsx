import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Modal,
  Button,
  TextInput,
  useColorScheme,
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
  const colorScheme = useColorScheme();

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

  const handleCreate = () => {
    console.log({
      date,
      time,
      spouseName,
      location,
    });
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require("../assets/logo.png")} />
        <Text style={styles.titleText}>Wedding Form</Text>
      </View>

      <Text style={styles.label}>Wedding Date</Text>
      <Pressable style={styles.dateContainer} onPress={openDatePicker}>
        <Image source={require("../assets/calendar.png")} />
        <Text style={styles.value}>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Pressable>

      <Text style={styles.label}>Wedding Time</Text>
      <Pressable style={styles.dateContainer} onPress={openTimePicker}>
        <Image source={require("../assets/watch.png")} />
        <Text style={styles.value}>
          {time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
      </Pressable>

      <Text style={styles.label}>Spouse Name</Text>
      <View style={styles.dateContainer}>
        <Image source={require("../assets/person.png")} />
        <TextInput
          style={styles.textInput}
          placeholder="Enter spouse name"
          placeholderTextColor="#999"
          value={spouseName}
          onChangeText={setSpouseName}
        />
      </View>

      <Text style={styles.label}>Location</Text>
      <View style={styles.dateContainer}>
        <Image source={require("../assets/location.png")} />
        <TextInput
          style={styles.textInput}
          placeholder="Enter location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <Pressable style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </Pressable>

      {Platform.OS === "ios" && (
        <>
          <Modal visible={showIOSModal} transparent animationType="slide">
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard(colorScheme)}>
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
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard(colorScheme)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4DFFD",
  },
  titleContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  titleText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 28,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 30,
    marginBottom: 12,
    borderRadius: 10,
  },
  label: {
    fontFamily: "Poppins_500Medium",
    marginBottom: 6,
    marginHorizontal: 30,
    fontSize: 16,
  },
  value: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#7C3AED",
    marginHorizontal: 30,
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalCard: (colorScheme) => ({
    backgroundColor: colorScheme === "dark" ? "#000" : "#FFF",
    alignItems: "center",
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  }),
});
