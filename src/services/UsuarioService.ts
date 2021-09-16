import { FirebaseService } from "../db/Firebase";
import Usuario from "../models/Usuario";
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseDatabase = firebase.firestore();

export default class UsuarioService extends FirebaseService<Usuario> {
  getCollection(): string {
    return "usuarios";
  }
  getUserByEmail(email: string) {
    return firebaseDatabase
      .collection(this.getCollection())
      .where("email", "==", email)
      .get()
      .then((doc) => {
        if (doc.empty) return undefined;
        return doc.docs[0];
      });
  }
}

