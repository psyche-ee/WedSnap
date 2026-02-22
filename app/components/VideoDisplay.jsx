import { View, Text, StyleSheet, Image } from 'react-native';

const VideoDisplay = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Videos</Text>

      <View style={styles.grid}>
        {[1,2,3,4].map((item) => (
          <View key={item} style={styles.card}>
            <Image
              source={require('../../assets/videoPlaceholder.png')}
              style={styles.image}
            />
          </View>
        ))}
      </View>
      <Text style={styles.more}>more</Text>
    </View>
  );
};

export default VideoDisplay;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 100,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    height: 120,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 40,
    height: 40,
    opacity: 0.4,
  },

  more: {
    alignSelf: 'flex-end',
    color: '#333',
  },
});