import firebase from "firebase/app";
import "firebase/firestore";
import BaseModel from "../models/BaseModel";

export default abstract class FirebaseService<M extends BaseModel> {
  /**
   * Retorna uma instância do banco Firestore.
   *
   * @returns Instância do Firestore
   */
  static db(): firebase.firestore.Firestore {
    return firebase.firestore();
  }

  /**
   * Construtor do serviço.
   *
   * @param collection Path ou nome da coleção no Firestore.
   * @example "users"
   * @example `rooms/${roomId}/messages`
   */
  constructor(readonly collection: string) {}

  /**
   * Converte o modelo de objeto para o modelo de dados do Firestore.
   * {@link https://firebase.google.com/docs/reference/js/v8/firebase.firestore.FirestoreDataConverter}
   *
   * @param modelObject Modelo do objeto
   * @returns Dados a serem persistidos no Firestore
   */
  toFirestore(modelObject: Partial<M>): firebase.firestore.DocumentData {
    const data = Object.assign({}, modelObject);
    Reflect.deleteProperty(data, "id");
    return data;
  }

  /**
   * Converte o modelo de dados do Firestore para o modelo de dados utilizado no app.
   * {@link https://firebase.google.com/docs/reference/js/v8/firebase.firestore.FirestoreDataConverter}
   *
   * @param snapshot Snapshot do modelo de dados do Firestore
   * @param options Opções de conversão do snapshot
   * @returns Modelo de dados utilizado no app, com o id do registro.
   */
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    options?: firebase.firestore.SnapshotOptions
  ): M {
    const model = snapshot.data(options) as M;
    model.id = snapshot.id;
    return model;
  }

  /**
   * Retorna a coleção padrão do modelo de dados, com seu conversor.
   *
   * @returns Coleção de documentos do Firestore com seu conversor.
   */
  getCollectionRef() {
    return FirebaseService.db().collection(this.collection).withConverter(this);
  }

  /**
   * Busca um objeto pelo seu ID.
   *
   * @param id id do registro no firestore
   * @returns o objeto buscado ou undefined
   */
  async getById(id: string): Promise<M | undefined> {
    return this.getCollectionRef()
      .doc(id)
      .get()
      .then((doc) => doc.data());
  }

  /**
   * Cria um novo registro do objeto no Firestore. Adiciona automaticamente o campo de data de criação.
   *
   * @param data Objeto a ser adicionado
   * @returns o ID do objeto criado
   */
  async pushData(data: M): Promise<string> {
    Reflect.deleteProperty(data, "createdAt");
    return this.getCollectionRef()
      .add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => doc.id);
  }

  updateData(id: string, objToSubmit: Partial<M>) {
    return this.getCollectionRef().doc(id).update(objToSubmit);
  }

  remove(id: string) {
    return this.getCollectionRef().doc(id).delete();
  }
}
