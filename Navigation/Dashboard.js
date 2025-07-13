import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function Dashboard() {

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();

  const animatedValue = useRef(new Animated.Value(0)).current;
  // Interpolate the animated value to transition between colors
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    const animateColor = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000, // 3 seconds to go from white to orange
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000, // 3 seconds to go back to white
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColor();
  }, [animatedValue]);

  return (
    
    <View style={styles.container}>        
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>    
      <LinearGradient
            colors={['#FFFFFF', '#222831']} 
            start={{ x: 0.7, y: -2 }} 
            end={{ x: 0.7, y: 0.8 }}  >
        <View style={styles.content}>
        
          <View style={styles.topNav}>
              <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
              <Text style={{color: '#fff', fontSize: 10, alignSelf: 'center'}}>Released. Unreleased.</Text>         
          </View> 
        
          {/* Horizontal dividing line */}
          <View style={styles.divider} />   

          <View style={styles.transparentBox}>
              <Text style={styles.numberDisplay}>0</Text>
              <Text style={styles.descDisplay}>leaked albums</Text>
          </View>

          <View style={styles.transparentBox}>
              <Text style={styles.numberDisplay}>0</Text>
              <Text style={styles.descDisplay}>leaked singles</Text>
          </View>

          <View style={styles.transparentBox}>
              <Text style={styles.numberDisplay}>0</Text>
              <Text style={styles.descDisplay}>leaked teasers</Text>
          </View>

        </View>
        </LinearGradient>
        </TouchableWithoutFeedback>
        
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    justifyContent: 'space-between'
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 60
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  transparentBox: {
    alignSelf: 'center',
    width: 220, // You can adjust the width
    height: 140, // You can adjust the height
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // White with 50% transparency
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10, 
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 30
  },
  topNav: {
    flexDirection: 'column',
    justifyContent: 'space-around', 
    width: '100%',
    height: 40,
    alignContent: 'center'
  },
  divider: {
    height: 1, // Height of the line
    width: '80%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.30)', // Color of the line
    marginVertical: 20, // Space above and below the line
    alignSelf: 'center',
    marginTop: 10
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes navigation items evenly
    backgroundColor: '#E3651D',
    paddingVertical: 30
  },
  navItem: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 65,
    marginRight: 65
  },
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  },
  numberDisplay: {
    fontSize: 50,
    color: '#fff',
    marginLeft: 25,
    fontWeight: 'bold'
  },
  descDisplay: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 25,
    fontWeight: 'bold'
  }
});