import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Import Realtime Database methods
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { auth, database } from '../firebase/config';

export default function SignUpScreen() {

  const navigation = useNavigation();

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const errMsg = 'Error: Please enter valid account details.';

  // Sign-Up function  
  const handleSignUp = async () => { 
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedName = name?.trim();
  
    if (!trimmedName) {
      console.log('Validation failed: Name is missing');
      setModalMessage(errMsg);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }
  
    if (!isValidEmail(trimmedEmail)) {
      console.log('Validation failed: Invalid email format', trimmedEmail);
      setModalMessage(errMsg);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }
  
    if (!trimmedPassword) {
      console.log('Validation failed: Password is missing');
      setModalMessage(errMsg);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }
  
    try {
      setLoading(true);
      setModalMessage('Loading...');
      setModalVisible(true);
  
      // Sign up the user first
      console.log('Creating user with Firebase Authentication...');
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;
  
      console.log('User created successfully:', user);
  
      // Save user data in the Realtime Database under the user's UID
      console.log('Saving user data to the database...');
      await set(ref(database, 'users/' + user.uid), {
        name: trimmedName,
        email: trimmedEmail
      });
      console.log('User data saved successfully');
  
      setTimeout(() => {
        setLoading(false);
        setModalVisible(false);
        console.log('Navigating to Sign-In screen...');
        navigation.navigate('SignInScreen');
      }, 3000);
  
    } catch (error) {
      setLoading(false);
      console.error('Error during sign-up:', error);
      
      if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        console.log('Error: Weak password');
        setModalMessage('Error: Password should be at least 6 characters.');
      } else {
        console.log('Error: General sign-up failure');
        setModalMessage('Error: Failed to create account. Please try again.');
      }
      
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    <View style={styles.container} className="bg-[#222831]">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.content}>
        <Animated.Text 
            style={{ color: animatedColor }}
            className="text-white text-[64px] font-bold"
            allowFontScaling={false}>
          LeakedBit
        </Animated.Text>
        <View className="w-[280px] h-[350px] bg-white/5 border border-white/50 rounded-xl justify-center mt-8 mb-12 py-5">
              <TextInput
                className="border-b border-white text-white text-[20px] my-4 mx-9"
                placeholder="Artist Name"
                placeholderTextColor="#fff" 
                value={name}
                onChangeText={setArtistName}
                autoCapitalize="none"
                maxLength={22}
              />
              <TextInput
                className="border-b border-white text-white text-[20px] my-4 mx-9"
                placeholder="Email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                inputMode="email"
              />
              <TextInput
                className="border-b border-white text-white text-[20px] my-4 mx-9"
                placeholder="Password"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={40}
              />
             <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>SIGN UP</Text>
             </TouchableOpacity>
             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 14 }}>
                <Text style={{ color: '#fff', fontSize: 13, paddingRight: 4 }}>
                  Already a member?  
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                  <Text style={styles.signintext}>Sign in here</Text>
                </TouchableOpacity>
              </View>
        </View>
         {/* Modal for loading/error messages */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>{modalMessage}</Text>
                  </>
                ) : (
                  <Text style={styles.loadingText}>{modalMessage}</Text>
                )}
              </View>
            </View>
          </Modal>
      </View>
      </TouchableWithoutFeedback>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  content: {
    alignItems: 'center',
    paddingTop: 120
  },
  maintext: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold'
  },
  transparentBox: {
    width: 280, // You can adjust the width
    height: 280, // You can adjust the height
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // White with 50% transparency
    color: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10, 
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    paddingBottom: 30
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background with transparency
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#E3651D',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  loginTextField: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 15,
    marginVertical: 15,
    fontWeight: "50",
    color: '#fff',
    marginLeft: 35,
    marginRight: 35
  },
  navItem: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff', // Green color for the button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 65,
    marginRight: 65
  },
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  },
  signintext: {
    color: '#fff', 
    fontSize: 13, 
    textDecorationLine: 'underline'
  }
});