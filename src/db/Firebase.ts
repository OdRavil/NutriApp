import firebase from "firebase/app";
import "firebase/firestore";

const firebaseDatabase = firebase.firestore();

export abstract class FirebaseService<
  T extends firebase.firestore.DocumentData
> {
  abstract getCollection(): string;

  pushData(objToSubmit: Partial<T>) {
    return firebaseDatabase
      .collection(this.getCollection())
      .add(objToSubmit)
      .then((doc) => doc.id);
  }

  updateData(id: string, objToSubmit: Partial<T>) {
    return firebaseDatabase
      .collection(this.getCollection())
      .doc(id)
      .update(objToSubmit);
  }

  remove(id: string) {
    return firebaseDatabase.collection(this.getCollection()).doc(id).delete();
  }
}
