import React, { createContext, useState, useEffect, useContext } from "react";
import firebase from "firebase";
import "firebase/auth";
import { getAuth, setAuth as setAuthStorage } from "../../utils/storage";
import UsuarioService from "../../services/UsuarioService";
import Usuario, { TipoUsuario } from "../../models/Usuario";

export interface Auth {
	user: {
		id: string;
		nome: string;
		email: string;
		tipo: TipoUsuario;
	};
}

export interface AuthContextData {
	signed: boolean;
	auth: Auth;
	setAuthUser(auth: Auth): void;
	login(code: string, phoneNumber: string): Promise<Auth>;
	register(usuario: Usuario, email: string, senha: string): Promise<Auth>;
	logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider: React.FC = ({ children }) => {
	const [auth, setAuth] = useState<Auth | undefined>(undefined);

	useEffect(() => {
		const authTemp = getAuth();
		if (authTemp) {
			setAuth(authTemp);
		}
	}, []);

	const setAuthUser = (authUser: Auth): void => {
		setAuth(authUser);
		setAuthStorage(authUser);
	};

	const login = async (email: string, senha: string): Promise<Auth> => {
		const authUser: Auth = {} as any;
		try {
			await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
			const credentials = await firebase
				.auth()
				.signInWithEmailAndPassword(email, senha);
			if (!credentials.user) throw new Error("Não foi possível logar usuário.");
			const { uid } = credentials.user;
			const user = await new UsuarioService().getById(uid);
			if (!user) throw new Error("Não foi possível logar usuário.");
			authUser.user = {
				id: user.id!,
				nome: user.nome,
				email: user.email,
				tipo: user.tipo,
			};
			return authUser;
		} finally {
			if (authUser.user) {
				setAuthUser(authUser);
			}
		}
	};

	const logout = async () =>
		firebase
			.auth()
			.signOut()
			.then(() => {
				localStorage.clear();
				sessionStorage.clear();
				setAuth(undefined);
			});

	const register = async (
		usuario: Usuario,
		email: string,
		senha: string
	): Promise<Auth> => {
		const credentials = await firebase
			.auth()
			.createUserWithEmailAndPassword(email, senha);
		if (!credentials.user) {
			throw new Error(
				"Erro ao cadastrar usuário.\nUsuário não cadastrado no Autenticador."
			);
		}
		const id = credentials.user!.uid;

		const usuarioService = new UsuarioService();
		await usuarioService.registrarUsuario(id, usuario);
		const authUser = await login(email, senha);
		if (!authUser.user) {
			throw new Error("Não foi possível logar usuário.");
		}
		return authUser as any;
	};

	const isSigned = (): boolean => !!auth && !!auth.user;

	return (
		<AuthContext.Provider
			value={{
				signed: isSigned(),
				auth: auth as any,
				login,
				logout,
				register,
				setAuthUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext<AuthContextData>(AuthContext);
