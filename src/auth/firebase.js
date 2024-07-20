

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAZHfHbdRILuAqhbv7pjAJNNMJzZWI4hhc",
  authDomain: "powellinspection.firebaseapp.com",
  projectId: "powellinspection",
  storageBucket: "powellinspection.appspot.com",
  messagingSenderId: "868353797491",
  appId: "1:868353797491:web:31e4ceba87288439b1e906",
  measurementId: "G-VVDGKDRPDV"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore as db, storage };
