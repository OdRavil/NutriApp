import firebase from "firebase/app";
import "firebase/firestore";
export default interface BaseModel {
  id?: string;
  createdAt?: firebase.firestore.Timestamp;
}
