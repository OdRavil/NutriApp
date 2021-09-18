import FirebaseService from "../db/Firebase";
import Usuario from "../models/Usuario";

export default class UsuarioService extends FirebaseService<Usuario> {
  constructor() {
    super("usuarios");
  }

  getUsuarioPorEmail(email: string) {
    return this.getCollectionRef()
      .where("email", "==", email)
      .get()
      .then((doc) => {
        if (doc.empty) return undefined;
        return doc.docs[0].data();
      });
  }

  getUsuarioPorUidAuth(uid: string) {
    return this.getCollectionRef()
      .where("uid_auth", "==", uid)
      .get()
      .then((doc) => {
        if (doc.empty) return undefined;
        return doc.docs[0].data();
      });
  }
}
