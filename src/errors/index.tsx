export class UserNotFound extends Error {
	constructor() {
		super("E-mail não encontrado.");
	}
}

export class UserInactive extends Error {
	constructor() {
		super("Usuário inativo.");
	}
}
