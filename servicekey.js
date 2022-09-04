///expressfirebase-fc673

var firebase =require('firebase');
require("firebase/firestore");



var firebaseConfig = {
  apiKey: "AIzaSyB3TxST1bFADsUJa7L4IHtYV86jkSr07LM",
  authDomain: "expressfirebase-fc673.firebaseapp.com",
  projectId: "expressfirebase-fc673",
  storageBucket: "expressfirebase-fc673.appspot.com",
  messagingSenderId: "1016975049147",
  appId: "1:1016975049147:web:cf1d2f83abb76cf101c49e",
  measurementId: "G-JWJR37FH5P"
};


const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;