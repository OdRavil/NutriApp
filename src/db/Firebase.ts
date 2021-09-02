import firebase from "firebase/app";
import "firebase/firestore";

const firebaseDatabase = firebase.firestore();

export abstract class FirebaseService<
  T extends firebase.firestore.DocumentData
> {
  abstract getCollection(): string;

  pushData(objToSubmit: T) {
    return firebaseDatabase
      .collection(this.getCollection())
      .add(objToSubmit)
      .then((doc) => doc.id);
  }

  updateData(id: string, objToSubmit: T) {
    return firebaseDatabase
      .collection(this.getCollection())
      .doc(id)
      .update(objToSubmit);
  }
  arrayUnion(id: string, field: string, obj: T) {
    return firebaseDatabase
      .collection(this.getCollection())
      .doc(id)
      .update({ [field]: firebase.firestore.FieldValue.arrayUnion(obj) });
  }
  arrayRemove(id: string, field: string, obj: T) {
    return firebaseDatabase
      .collection(this.getCollection())
      .doc(id)
      .update({ [field]: firebase.firestore.FieldValue.arrayRemove(obj) });
  }

  remove(id: string) {
    return firebaseDatabase.collection(this.getCollection()).doc(id).delete(); //TODO: Terminar
  }
}
