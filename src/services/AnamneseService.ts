import FirebaseService from "../db/Firebase";
import Anamnese, { TipoAnamnese } from "../models/Anamnese";

export default class AnamneseService extends FirebaseService<Anamnese> {
	constructor() {
		super("anamneses");
	}

	listarPorAlunoTipo(idAluno: string, tipo: TipoAnamnese) {
		return this.getCollectionRef()
			.where("tipo", "==", tipo)
			.where("idAluno", "==", idAluno)
			.get()
			.then((result) => (result.empty ? undefined : result.docs[0].data()));
	}
}
