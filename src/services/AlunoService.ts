import FirebaseService from "../db/Firebase";
import Aluno from "../models/Aluno";
import TurmaService from "./TurmaService";

export default class AlunoService extends FirebaseService<Aluno> {
	private turmaService = new TurmaService();

	constructor() {
		super("alunos");
	}

	async listarPorEscola(escolas: string[]) {
		if (escolas.length === 0) return this.listar();
		const turmas = await this.turmaService
			.listarPorEscola(escolas)
			.then((lista) => lista.map((item) => item.id!));
		if (turmas.length === 0) return this.listar();
		return this.getCollectionRef()
			.where("idTurma", "in", turmas)
			.get()
			.then((query) => query.docs.map((item) => item.data()));
	}

	listar() {
		return this.getCollectionRef()
			.get()
			.then((query) => query.docs.map((item) => item.data()));
	}
}
