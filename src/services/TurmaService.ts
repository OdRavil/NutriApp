import FirebaseService from "../db/Firebase";
import Turma from "../models/Turma";

export default class TurmaService extends FirebaseService<Turma> {
	constructor() {
		super("turmas");
	}

	listar() {
		return this.getCollectionRef()
			.get()
			.then((query) => query.docs.map((item) => item.data()));
	}

	listarPorEscola(escolas: string[]) {
		return this.getCollectionRef()
			.get()
			.then((query) => query.docs.map((item) => item.data()))
			.then((lista) => lista.filter((item) => !!item.status))
			.then((lista) => lista.filter((item) => escolas.includes(item.idEscola)));
	}
}
