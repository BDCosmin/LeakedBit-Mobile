import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import './global.css';

import LoadingScreen from './LoadingScreen';

import Home from './Home';
import Registration from './Registration/Registration';
import SignInScreen from './Registration/SignInScreen';
import SignUpScreen from './Registration/SignUpScreen';

const Stack = createStackNavigator();

export default function App() {

  const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#222831', 
  },
};

  return (
    <View style={{ flex: 1, backgroundColor: '#222831' }}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="LoadingScreen"
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#222831',
            },
            cardStyle: { backgroundColor: '#222831' }, // Ensures transition bg
          }}
        >
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
