export const validarEmail = (email: string): boolean => {
	const regex =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
	return regex.test(email);
};

export const maskImc = (imc: string) => {
	if (!imc) return "";
	return imc.toString().replace(".", ",");
};
