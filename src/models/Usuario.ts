import firebase from "firebase/app";
import "firebase/firestore";

export enum TipoUsuario {
  ALUNO = 1,
  PROFESSOR = 2,
}

export enum Sexo {
  MASCULINO = "M",
  FEMININO = "F",
}

export default interface Usuario extends firebase.firestore.DocumentData {
  login: string;
  email: string;
  sexo: Sexo;
  tipo: TipoUsuario;
  nome: string;
  dataNascimento: firebase.firestore.Timestamp;
  turmaLista: Array<string>;
}
