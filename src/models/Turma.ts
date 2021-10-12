import BaseModel from "./BaseModel";

export default interface Turma extends BaseModel {
  codigo: string;
  descricao: string;
  idEscola: string;
}
