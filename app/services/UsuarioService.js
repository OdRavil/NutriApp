import {FirebaseService} from '../db';

export default class UsuarioService {
  static _COLLECTION = 'usuarios';

  static insert(obj) {
    return FirebaseService.pushData(UsuarioService._COLLECTION, obj);
  }
  static delete(id) {
    return FirebaseService.remove(UsuarioService._COLLECTION, id);
  }
  static update(id, obj) {
    return FirebaseService.updateData(UsuarioService._COLLECTION, id, obj);
  }
  static addTurma(idUsuario, idTurma) {
    return FirebaseService.arrayUnion(
      UsuarioService._COLLECTION,
      idUsuario,
      'turmaLista',
      idTurma,
    );
  }
}
