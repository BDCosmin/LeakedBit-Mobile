import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { auth } from '../firebase/config'; // Authentication

import BugReportModal from '../Settings/BugReportModal';
import DeleteAcc from '../Settings/DeleteAcc';
import OptionList from '../Settings/OptionList';
import ResetPass from '../Settings/ResetPass';
import UserPanel from '../Settings/UserPanel';

const Stack = createStackNavigator();

export default function Profile({ 
  handleLogout,
  fetchUserNameProfile,
  handlePasswordReset,
  name,
  setArtistName
 }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [bugModalVisible, setBugModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [bugReport, setBugReport] = useState('');

  const navigation = useNavigation();

  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmitReport = async (bugReport, setBugReport) => {
    if (!bugReport) {
      Alert.alert('Error', 'Please enter a valid report before sending.');
      return;
    }
    try {
      const result = await MailComposer.composeAsync({
        subject: 'LeakedBit: Bug Report',
        recipients: ['kozcontakt@gmail.com'],
        body: bugReport,
        isHtml: true,
      });
  
      if (result.status === MailComposer.MailComposerStatus.SENT) {
        setBugReport('');
      } else {
        Alert.alert('Report', 'Action cancelled.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while sending the report.');
    }
  };

  // Function to trigger confetti
  const triggerConfetti = () => {
    setShowConfetti(true); // This will trigger confetti in Profile
  };

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(animatedValue, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, [animatedValue]);

  useEffect(() => {
    fetchUserNameProfile(setArtistName, setLoading);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    setEmail(user ? user.email : 'No user logged in');
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
      <LinearGradient
            colors={['#FFFFFF', '#222831']} 
            start={{ x: 0.7, y: -2 }} 
            end={{ x: 0.7, y: 0.4 }}
            style={{width: '100%'}}  >
        <View style={styles.topNav}>
          <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
          <Text style={{ color: '#fff', fontSize: 10, alignSelf: 'center' }}>Released. Unreleased.</Text>
        </View>
        
        <View style={styles.divider} />

        <UserPanel name={name} triggerConfetti={triggerConfetti}/>  
        
        </LinearGradient>

        <ScrollView style={styles.optionsList}>
          <OptionList 
            setResetModalVisible={setResetModalVisible} 
            setDeleteModalVisible={setDeleteModalVisible} 
            setBugModalVisible={setBugModalVisible} 
          />

          <TouchableOpacity 
              style={{backgroundColor: 'rgba(79, 93, 114, 0.91)', height: 50, width: '99%', alignSelf: 'center', marginBottom: 3}}
              onPress={handleLogout}
              >
              <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
                  <Image 
                    source={require('./assets/logout.png')} 
                    style={{width: 30, height: 30}}                  
                    resizeMode="contain"                  
                  />
                  <View style={styles.optionContentText}>
                    <Text style={{color: '#fff', fontSize: 20}}>Log Out</Text>
                  </View>
              </View>  
          </TouchableOpacity>
        </ScrollView>
        {showConfetti && (
        <ConfettiCannon
          count={80}               // Number of confetti particles
          origin={{ x: 250, y: -50 }}    // Starting point for confetti (top of screen)
          autoStart={true}           // Start immediately
          fadeOut={true}             // Fade out confetti over time
          explosionSpeed={10}       // Speed of the explosion (adjust for effect)
          fallSpeed={5000}           // Speed at which confetti falls
          onAnimationEnd={() => setShowConfetti(false)}  // Reset after animation
          style={styles.confetti}
        />
      )}
      </View>
      
       {/* Bug report modal */}
       <BugReportModal 
        modalVisible={bugModalVisible} 
        setModalVisible={setBugModalVisible} 
        email={email} // Pass the email prop here
        bugReport={bugReport} 
        setBugReport={setBugReport} 
        handleSubmitReport={handleSubmitReport} 
      />

       {/* Reset password modal */}
      <ResetPass 
        modalVisible={resetModalVisible} 
        setModalVisible={setResetModalVisible} 
        currentPassword={currentPassword} 
        setCurrentPassword={setCurrentPassword} 
        newPassword={newPassword} 
        setNewPassword={setNewPassword} 
        handlePasswordReset={handlePasswordReset} 
      />

        {/* Delete account modal */}
        <DeleteAcc 
          modalVisible={deleteModalVisible} 
          setModalVisible={setDeleteModalVisible} 
        />

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
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  topNav: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-around', // Distributes navigation items evenly
    width: '100%',
    height: 80,
    paddingTop: 50
  },
  divider: {
    height: 1, // Height of the line
    width: '80%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.30)', // Color of the line
    marginVertical: 20, // Space above and below the line
    alignSelf: 'center',
    marginTop: 10
  },
  optionsList: {
    flexGrow: 1, // Ensure the ScrollView content expands
    backgroundColor: '#222831',
    width: '80%', 
    alignSelf: 'center'
  },
  userPanel: {
    backgroundColor: 'rgba(69, 81, 99, 0.89)',
    height: 130,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'column'
  },
  userHeader: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 15
  },
  userHeaderText: {
    flexDirection: 'column',
    marginLeft: 15,
    marginTop: 4
  },
  userName: {
    color: '#fff',
    fontSize: 24
  },
  userStatus: {
    color: '#cfcfcf',
    fontSize: 12,
    marginLeft: 1
  },
  editButton: {
    width: 70,
    height: 35,
    backgroundColor: '#495669',
    alignItems: 'center',
    paddingTop: 7,
    marginTop: 9,
    borderRadius: 2
  },
  textEditButton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  optionContainer: {
    backgroundColor: 'rgba(79, 93, 114, 0.91)',
    height: 100,
    width: '99%',
    alignSelf: 'center',
    marginBottom: 3
  },
  optionContent: {
    flexDirection: 'row',
    marginLeft: 24,
    marginTop: 14
  },
  optionContentText: {
    flexDirection: 'column',
    marginLeft: 14
  },
  optionTitle: {
    color: '#fff',
    fontSize: 20,
    marginTop: 4
  },
  optionDesc: {
    color: '#cfcfcf',
    fontSize: 12,
    marginLeft: 1
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    height: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222831'
  },
  inputReportEmail: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  inputReportMsg: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 20,
  },
  modalButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButtons: {
    color: '#fff', 
    fontWeight: 'bold', 
    paddingLeft: 25, 
    paddingRight: 25, 
    paddingTop: 12, 
    paddingBottom: 12,
  },
  confetti: {
    position: 'absolute',    // Ensure confetti covers the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,               // Make sure it appears on top of other components
  },
});