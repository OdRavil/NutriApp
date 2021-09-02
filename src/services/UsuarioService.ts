import { FirebaseService } from "../db/Firebase";
import Usuario from "../models/Usuario";

export default class UsuarioService extends FirebaseService<Usuario> {
  getCollection(): string {
    return "usuarios";
  }
}
