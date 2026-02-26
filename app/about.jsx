import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { Link } from "expo-router";
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins'
import { SafeAreaView } from "react-native-safe-area-context";

const about = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Link href={'/'}>
                <Image source={require('../assets/backArrow.png')} style={styles.backArrow} />
            </Link>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/wedsnap-banner.png')} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>About WedSnap</Text>
                <Text style={styles.description}>WedSnap is dedicated to making wedding memories accessible. We believe every smile should be shared the moment it happens, creating a collective album for your special day.</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Our Mission</Text>
                <Text style={styles.description}>To capture and share the magic of every wedding memory, effortlessly.</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Why WedSnap?</Text>
                <Text style={styles.description}>{'\u2022'} Instant Photo Sharing</Text>
                <Text style={styles.description}>{'\u2022'} Interactive Guest Albums</Text>
                <Text style={styles.description}>{'\u2022'} Relive Every Moment</Text>
                <Text style={styles.description}>{'\u2022'} Simple & Secure</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default about

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E4DFFD",
    },
    imageContainer: {
        marginTop: 10,
    },
    backArrow: {
        marginTop: 10
    },
    textContainer: {
        width: '80%',
        marginTop: 20,
        alignSelf: 'center',
    },
    title: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 20,
    },

    description: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        textAlign: 'justify',
    },
})