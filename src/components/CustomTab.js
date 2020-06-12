
import React from 'react';
import { View, Image, StyleSheet,Text } from 'react-native';

const styles = StyleSheet.create({
  logo: {
    width: 20,
    height: 20,
  },
});



const DisplayAnImage = ({src}) => {
  return (
    <View>
      <Image
       style={styles.logo}
       source={src} />
    </View>
  );
}

export default DisplayAnImage;
