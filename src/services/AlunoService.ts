import FirebaseService from "../db/Firebase";
import Aluno from "../models/Aluno";

export default class AlunoService extends FirebaseService<Aluno> {
	constructor() {
		super("alunos");
	}

	listarPorTurma(turmas: string[]) {
		return this.getCollectionRef()
			.where("idTurma", "in", turmas)
			.get()
			.then((query) => query.docs.map((item) => item.data()));
	}
}
