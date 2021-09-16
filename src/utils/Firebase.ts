import firebase from "firebase/app";
require('firebase/auth')

const config = require("./firebase.json");

export const initFirebaseApp = (): void => {
  if (firebase.apps.length == 0) {
      firebase.initializeApp(config)
  }
}

initFirebaseApp()

export function loginUser(email: string, password: string) {
  try {
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
        let res = await firebase.auth().signInWithEmailAndPassword(email, password)
        return res
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return false
      });
  } catch (e) {
    console.log(e)
    return false
  }
}