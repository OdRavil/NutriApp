import {FirebaseService} from '../db';

export default class TurmaService {
  static _COLLECTION = 'turmas';

  static insert(obj) {
    return FirebaseService.pushData(TurmaService._COLLECTION, obj);
  }
  static delete(id) {
    return FirebaseService.remove(TurmaService._COLLECTION, id);
  }
  static update(id, obj) {
    return FirebaseService.updateData(TurmaService._COLLECTION, id, obj);
  }
  static addUsuario(idUsuario, idTurma) {
    return FirebaseService.arrayUnion(
      TurmaService._COLLECTION,
      idUsuario,
      'usuarioLista',
      idTurma,
    );
  }
}
