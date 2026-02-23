import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const Navigation = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity><Image source={require('../../assets/Home.png')} /></TouchableOpacity>
      <TouchableOpacity><Image source={require('../../assets/Gallery.png')} /></TouchableOpacity>
      <TouchableOpacity><Image source={require('../../assets/Capture.png')} /></TouchableOpacity>
      <TouchableOpacity><Image source={require('../../assets/Settings.png')} /></TouchableOpacity>
      <TouchableOpacity><Image source={require('../../assets/About.png')} /></TouchableOpacity>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 30,

    elevation: 5,
  },

  active: {
    color: '#6A4C93',
  },
});