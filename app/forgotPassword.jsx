import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native'
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins'
import { Link } from 'expo-router'

const forgotPassword = () => {
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logo}/>
                <Text style={styles.title}>WedSnap</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Forgot Password</Text>
                <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput style={styles.inputField} placeholder='Email' />
                </View>
                <View style={styles.buttonContainer}>
                    <Link href='/login' asChild>
                        <Pressable style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </Link>
                    <Link href='/dashboard' asChild>
                        <Pressable style={styles.sendCodeButton}>
                            <Text style={styles.buttonText}>Send Code</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </View>
    )
}

export default forgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#E4DFFD'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    logo: {
        width: 100,
        height: 100
    },
    card: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        gap: 10
    },
    title: {
        fontSize: 36,
        fontFamily: 'Poppins_500Medium'
    },
    cardTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 10
    },
    inputView: {
        flexDirection: 'column',
        width: '100%'
    },
    inputTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular'
    },
    inputField: {
        backgroundColor: '#EEEEFB',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: '100%',
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        padding: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10
    },
    sendCodeButton: {
        backgroundColor: '#6A4C93',
        padding: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Poppins_500Medium'
    },
    cancelText: {
        color: '#6A4C93',
        fontFamily: 'Poppins_500Medium'
    },
})