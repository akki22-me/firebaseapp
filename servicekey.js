///expressfirebase-fc673

var firebase =require('firebase');
require("firebase/firestore");



var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};


const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;