import firebase from "firebase/app";
import "firebase/firestore";
import BaseModel from "./BaseModel";
import { Sexo } from "./Usuario";

export default interface Aluno extends BaseModel {
	nome: string;
	email?: string;
	sexo?: Sexo;
	dataNascimento?: firebase.firestore.Timestamp;
	idTurma: string;
}
