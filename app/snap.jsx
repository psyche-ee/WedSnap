import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

import PhotoDisplay from './components/PhotoDisplay';
import VideoDisplay from './components/VideoDisplay';
import Navigation from './components/Navigation';
import { Ionicons } from '@expo/vector-icons';

const snap = () => {
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_400Regular
    });

    const [image, setImage] = useState(null);

    if (!fontsLoaded) {
        return null;
    }

    // 📷 Open Camera
    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // photo + video
        quality: 1,
        });

        if (!result.canceled) {
        setImage(result.assets[0].uri);
        }
    };

    // 📁 Open Gallery
    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        });

        if (!result.canceled) {
        setImage(result.assets[0].uri);
        }
    };

    const showOptions = () => {
        Alert.alert(
            "Upload",
            "Choose an option",
            [
            { text: "Camera", onPress: openCamera },
            { text: "Gallery", onPress: openGallery },
            { text: "Cancel", style: "cancel" }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
             <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <Text style={styles.title}>Welcome Username</Text>

                    <View style={styles.imageRow}>
                    <Image style={[styles.avatar, { zIndex: 3 }]} source={require('../assets/1.png')} />
                    <Image style={[styles.avatar, { zIndex: 2 }]} source={require('../assets/2.png')} />
                    <Image style={[styles.avatar, { zIndex: 1 }]} source={require('../assets/3.png')} />
                    </View>
                </View>
                <Text style={styles.description}>Upload and view wedding memories.</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={showOptions}>
                    <Ionicons name="camera" size={32} color="#fff" />
                    <Text style={styles.buttonText}>Upload Photo or Video</Text>
                </TouchableOpacity>
                {image && (
                    <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10, marginHorizontal: 'auto' }} />
                )}
                <PhotoDisplay />
                <VideoDisplay />
            </ScrollView>
            <Navigation />
        </SafeAreaView>
    );
};

export default snap;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E4DFFD',
        paddingHorizontal: 20,
        gap: 20,
    },

    title: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 20,
    },

    description: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },

    topSection: {
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    imageRow: {
        flexDirection: 'row',
        paddingLeft: 10,
    },

    avatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginLeft: -10,
        borderWidth: 2,
        borderColor: '#E4DFFD',
    },

    uploadBtn: {
        flexDirection: 'row',
        backgroundColor: '#D4AF37',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    buttonText: {
        fontFamily: 'Poppins_500Medium',
        color: '#fff',
        fontSize: 16,
    }
});