import { FirebaseService } from "../db/Firebase";
import Turma from "../models/Turma";

export default class TurmaService extends FirebaseService<Turma> {
  getCollection(): string {
    return "turmas";
  }
}
