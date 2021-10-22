import FirebaseService from "../db/Firebase";
import Escola from "../models/Escola";

export default class EscolaService extends FirebaseService<Escola> {
	constructor() {
		super("escolas");
	}

	listar() {
		return this.getCollectionRef()
			.get()
			.then((query) => query.docs.map((item) => item.data()));
	}
}
