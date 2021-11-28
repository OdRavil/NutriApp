import React, { createContext, useState, useEffect, useContext } from "react";
import firebase from "firebase";
import "firebase/auth";
import StorageService, {
	getAuth,
	setAuth as setAuthStorage,
} from "../../utils/storage";
import UsuarioService from "../../services/UsuarioService";
import Usuario, { TipoUsuario } from "../../models/Usuario";
import { UserInactive, UserNotFound } from "../../errors";

export interface Auth {
	user: {
		id: string;
		nome: string;
		email: string;
		tipo: TipoUsuario;
		listaEscola: string[];
	};
}

export interface AuthContextData {
	signed: boolean;
	loaded: boolean;
	auth: Auth;
	setAuthUser(auth: Auth): void;
	login(code: string, phoneNumber: string): Promise<Auth>;
	register(usuario: Usuario, email: string, senha: string): Promise<Auth>;
	logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider: React.FC = ({ children }) => {
	const [auth, setAuth] = useState<Auth | undefined>(undefined);
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		getAuth().then((authTemp) => {
			if (authTemp) {
				setAuth(authTemp);
			}
			setLoaded(true);
		});
	}, []);

	const setAuthUser = (authUser: Auth): void => {
		setAuth(authUser);
		setAuthStorage(authUser);
	};

	const login = async (email: string, senha: string): Promise<Auth> => {
		const authUser: Auth = {} as any;
		try {
			const usuarioPorEmail = await new UsuarioService().getUsuarioPorEmail(email);
			if (!usuarioPorEmail) throw new UserNotFound();
			if (!usuarioPorEmail.status) throw new UserInactive();
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
				listaEscola: user.listaEscola || [],
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
			.then(async () => {
				localStorage.clear();
				sessionStorage.clear();
				await StorageService.getInstance().clear();
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
				loaded,
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
