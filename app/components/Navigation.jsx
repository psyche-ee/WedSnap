import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navigation = () => {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.iconWrapper}>
        <Ionicons name="home" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconWrapper}>
        <Ionicons name="images" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.iconWrapper, styles.iconWrapper]}>
        <Ionicons name="camera" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconWrapper}>
        <Ionicons name="settings" size={24} color="#6A4C93" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconWrapper}>
        <Ionicons name="person" size={24} color="#6A4C93" />
      </TouchableOpacity>

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
    paddingVertical: 12,
    borderRadius: 50,

    elevation: 8,
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: '#F3F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerIcon: {
    backgroundColor: '#6A4C93',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -25, // floating effect
    elevation: 10,
  },
});