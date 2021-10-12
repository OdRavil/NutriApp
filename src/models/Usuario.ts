import firebase from "firebase/app";
import "firebase/firestore";
import BaseModel from "./BaseModel";

export enum TipoUsuario {
  ADMINISTRADOR = "ADMINISTRADOR",
  NUTRICIONISTA = "NUTRICIONISTA",
  PROFESSOR = "PROFESSOR",
}

export enum Sexo {
  MASCULINO = "M",
  FEMININO = "F",
}

export default interface Usuario extends BaseModel {
  nome: string;
  email: string;
  sexo?: Sexo;
  tipo: TipoUsuario;
  dataNascimento?: firebase.firestore.Timestamp;
}
