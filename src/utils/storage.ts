import { Auth } from "../context/auth";

export const getAuth = (): Auth | undefined => {
	const auth = localStorage.getItem("auth");
	return auth ? (JSON.parse(auth) as Auth) : undefined;
};

export const setAuth = (auth: Auth) => {
	localStorage.setItem("auth", JSON.stringify(auth));
};
