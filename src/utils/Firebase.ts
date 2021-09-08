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
