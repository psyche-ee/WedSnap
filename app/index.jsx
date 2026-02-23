import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins'
import { Link } from 'expo-router'

const index = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E4DFFD' }}>
      <Link href="/about" style={{ position: 'absolute', top: 60, right: 30 }}>
        <Image source={require('../assets/aboutLogin.png')} />
      </Link>
      <Image source={require('../assets/logo.png')} style={{ width: 150, height: 150 }} />
      <Text style={{ fontSize: 36, fontFamily: 'Poppins_500Medium' }}>WedSnap</Text>
      <Text style={{ fontSize: 18, fontFamily: 'Poppins_400Regular' }}>The Snap of a Lifetime</Text>
      
      <View style={{ flexDirection: 'column', marginTop: 100, width: '80%', gap: 20}}>
        <Link href='/login' asChild>
          <Pressable style={{ backgroundColor: '#6A4C93', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%'}}>
            <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium'}}>Login</Text>
          </Pressable>
        </Link>
        <Link href='/signup' asChild>
          <Pressable style={{ backgroundColor: '#D4AF37', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%'}}>
            <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium'}}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})