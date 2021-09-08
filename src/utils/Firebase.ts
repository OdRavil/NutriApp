import firebase from "firebase/app";
require('firebase/auth')

const config = require("./firebase.json");

firebase.initializeApp(config);

export async function loginUser(email: string, password: string) {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(email, password)
    console.log(res)
    return true
  } catch (e){
    console.log(e)
    return false
  }
}

import config from "./firebase.json";

var _firebaseApp: firebase.app.App;
export const firebaseApp = (): firebase.app.App => {
  if (firebase.apps.length == 0) {
    console.log("Criando novo App firebase");
    _firebaseApp = firebase.initializeApp(config);
  }
  if (firebase.apps.length > 0 && !_firebaseApp) {
    console.log("Reusando App firebase");
    _firebaseApp = firebase.apps[0];
  }
  return _firebaseApp;
};