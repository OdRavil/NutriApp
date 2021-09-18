import firebase from "firebase/app";
import "firebase/firestore";
import BaseModel from "./BaseModel";

export enum TipoUsuario {
  ALUNO = 1,
  PROFESSOR = 2,
}

export enum Sexo {
  MASCULINO = "M",
  FEMININO = "F",
}

export default interface Usuario extends BaseModel {
  uid_auth?: string;
  nome: string;
  email: string;
  login?: string;
  sexo?: Sexo;
  tipo: TipoUsuario;
  dataNascimento?: firebase.firestore.Timestamp;
  turmaLista: Array<string>;
  primeiroAcesso: boolean;
}
