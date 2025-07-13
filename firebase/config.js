import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC2fKxzs4jdainImtxg1jSAiNPaz4lHU34",
  authDomain: "leakedbit.firebaseapp.com",
  projectId: "leakedbit",
  storageBucket: "leakedbit.appspot.com",
  messagingSenderId: "864027322451",
  appId: "1:864027322451:android:542cc359e801d64f653ea6",
};

let app;
let auth;
let database;
let storage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  database = getDatabase(app);
  storage = getStorage(app);
} else {
  app = getApp();
  auth = getAuth(app);
  database = getDatabase(app);
  storage = getStorage(app);
}

export { app, auth, database, storage };

