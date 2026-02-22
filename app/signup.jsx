import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native'
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins'
import { Link } from 'expo-router'

const signup = () => {
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
                <Text style={styles.cardTitle}>Sign up</Text>
                <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput style={styles.inputField} placeholder='Email' />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput style={styles.inputField} placeholder='Password' />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputTitle}>Confirm Password</Text>
                    <TextInput style={styles.inputField} placeholder='Confirm Password' />
                </View>
                <Link href='/dashboard' asChild>
                    <Pressable style={styles.loginButton}>
                    <Text style={styles.buttonText}>Sign up</Text>
                    </Pressable>
                </Link>
                <Link href="/login">
                    <Text style={styles.login}>
                        Already have an account?{' '}
                        <Text style={styles.highlight}>Login.</Text>
                    </Text>
                </Link>
            </View>
        </View>
    )
}

export default signup

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
    forgotPasswordLink: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#B3B3B3',
        alignSelf: 'flex-start'
    },
    loginButton: {
        backgroundColor: '#6A4C93',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginVertical: 10
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Poppins_500Medium'
    },
    login: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#B3B3B3',
    },
    highlight: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#6A4C93',
    }
})