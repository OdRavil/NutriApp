import firebase from 'firebase';
const config = require('./firebase.json');

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
