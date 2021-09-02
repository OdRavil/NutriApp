import firebase from "firebase/app";
import "firebase/firestore";

export default interface Turma extends firebase.firestore.DocumentData {
  codigo: string;
  descricao: string;
  usuariosLista: Array<string>;
}
