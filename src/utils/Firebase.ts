import firebase from "firebase/app";
import Usuario from "../models/Usuario";
import UsuarioService from "../services/UsuarioService";
require("firebase/auth");

const config = require("./firebase.json");

export const initFirebaseApp = (): void => {
  if (firebase.apps.length == 0) {
    firebase.initializeApp(config);
  }
};

initFirebaseApp();

export async function loginUser(
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() =>
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (credentials) => {
          if (!credentials.user)
            throw new Error("Não foi possível logar usuário.");
          const uid = credentials.user.uid;
          const user = await new UsuarioService().getById(uid);
          if (!user) throw new Error("Não foi possível logar usuário.");
          localStorage.setItem("user", user.id!);
          localStorage.setItem("user_type", user.tipo.toString());
          return credentials;
        })
    );
}

export async function getCurrentUser(): Promise<Usuario | undefined> {
  const id = localStorage.getItem("user");
  if (!id) return Promise.resolve(undefined);
  return new UsuarioService().getById(id);
}
