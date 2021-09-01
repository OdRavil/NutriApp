import firebase from 'firebase';
const config = require('./firebase.json');

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.firestore();

export class FirebaseService {
  static pushData = (collection, objToSubmit) => {
    return firebaseDatabase
      .collection(collection)
      .add(objToSubmit)
      .then(doc => doc.id);
  };

  static updateData = (collection, id, objToSubmit) => {
    return firebaseDatabase.collection(collection).doc(id).update(objToSubmit);
  };
  static arrayUnion = (collection, id, field, obj) => {
    return firebaseDatabase
      .collection(collection)
      .doc(id)
      .update({[field]: firebase.firestore.FieldValue.arrayUnion(obj)});
  };
  static arrayRemove = (collection, id, field, obj) => {
    return firebaseDatabase
      .collection(collection)
      .doc(id)
      .update({[field]: firebase.firestore.FieldValue.arrayRemove(obj)});
  };

  static remove = (collection, id) => {
    return firebaseDatabase.collection(collection).doc(id).delete(); //TODO: Terminar
  };
}
