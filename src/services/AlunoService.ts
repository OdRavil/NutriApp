import FirebaseService from "../db/Firebase";
import Aluno from "../models/Aluno";

export default class EscolaService extends FirebaseService<Aluno> {
	constructor() {
		super("alunos");
	}
}
