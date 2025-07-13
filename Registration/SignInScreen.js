import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database'; // Import Realtime Database methods
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { auth } from '../firebase/config';

export default function SignInScreen() {

  const navigation = useNavigation(); // Access navigation using the hook

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const errMsg = 'Error: Please enter valid account details.';

  const getEmailByName = async (name) => {
    try {
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        const nameQuery = query(usersRef, orderByChild('name'), equalTo(name));

        const snapshot = await get(nameQuery);

        if (snapshot.exists()) {
            const userData = Object.values(snapshot.val())[0]; // Get the first match
            return userData.email; // Assuming the email is stored in the 'email' field
        } else {
            console.warn('No user found for the provided name:', name);
            return null;
        }
    } catch (error) {
        console.error('Error fetching email by name:', error);
        return null;
    }
};

   // Sign-In function using name and password
   const handleSignIn = async () => {
    const trimmedName = name?.trim();
    const trimmedPassword = password?.trim();
  
    if (!trimmedName || !trimmedPassword) {
      setModalMessage(errMsg); // Set validation error message
      setModalVisible(true); // Show the modal
      setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
      return;
    }
   
    try {
      console.log('Starting sign-in process...');
      console.log('Fetching email for name:', trimmedName);

      // Step 1: Sign in with Firebase Authentication using the provided name and password
      const emailToSignIn = await getEmailByName(trimmedName); // Function to fetch email by artist name

      console.log('Email fetched:', emailToSignIn);
  
      if (!emailToSignIn) {
        setModalMessage('Error: No account found for the provided name.');
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
        return;
      }
  
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, trimmedPassword);
      const user = userCredential.user;
  
      // Step 2: Fetch user details from the Realtime Database after authentication
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        // User data successfully retrieved
        setModalMessage(`Welcome back, ${user.displayName || trimmedName}`);
        setModalVisible(true);
        setTimeout(async () => {
          setLoading(false);
          setModalVisible(false);
          await AsyncStorage.removeItem('loggedOut'); 
          navigation.replace('HomeScreen'); 
        }, 2000);
      } else {
        setModalMessage('Error: User data not found in the database.');
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
      }
    } catch (error) {
      setModalMessage('Error: The name or password is incorrect.');
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
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
    <View className="flex-1 bg-[#222831] pt-5 justify-between">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="items-center pt-40">
          <Animated.Text
            style={{ color: animatedColor }}
            className="text-white text-[64px] font-bold"
            allowFontScaling={false}
          >
            LeakedBit
          </Animated.Text>

          <View className="w-[280px] h-[280px] bg-white/5 border border-white/50 rounded-xl justify-center mt-8 py-5">
            <TextInput
              className="border-b border-white text-white text-[20px] my-4 mx-9"
              placeholder="Artist Name"
              placeholderTextColor="white"
              value={name}
              onChangeText={setArtistName}
              autoCapitalize="none"
              allowFontScaling={false}
            />
            <TextInput
              className="border-b border-white text-white text-[20px] my-4 mx-9"
              placeholder="Password"
              placeholderTextColor="white"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              className="bg-white py-3 px-6 rounded-xl items-center mt-4 mx-[65px]"
              onPress={handleSignIn}
            >
              <Text className="text-[#1E201E] text-[15px] font-bold">
                SIGN IN
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center self-center mt-4">
              <Text className="text-white text-[13px] pr-1">
                Are you new here?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text className="text-white text-[13px] underline">
                  Sign up now
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal for loading/error messages */}
            <Modal visible={modalVisible} transparent animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-4/5 bg-[#E3651D] p-5 rounded-xl items-center">
                  {loading ? (
                    <>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text className="text-white font-bold text-[15px] text-center mt-2">
                        {modalMessage}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-white font-bold text-[15px] text-center">
                      {modalMessage}
                    </Text>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <StatusBar style="auto" />
    </View>
  );
}