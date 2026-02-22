import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Navigation = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity><Text style={styles.active}>🏠</Text></TouchableOpacity>
      <TouchableOpacity><Text>🖼️</Text></TouchableOpacity>
      <TouchableOpacity><Text>📷</Text></TouchableOpacity>
      <TouchableOpacity><Text>⚙️</Text></TouchableOpacity>
      <TouchableOpacity><Text>ℹ️</Text></TouchableOpacity>
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