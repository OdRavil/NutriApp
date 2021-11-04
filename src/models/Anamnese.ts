import BaseModel from "./BaseModel";

export enum TipoAnamnese {
	DIABETES_METLITUS = "DIABETES_METLITUS",
	HIPERTENSAO = "HIPERTENSAO",
	OBESIDADE = "OBSEDIDADE",
}

export function getTipoAnamneseText(tipo: TipoAnamnese) {
	switch (tipo) {
		case TipoAnamnese.DIABETES_METLITUS:
			return "Diabetes Mellitus";
		case TipoAnamnese.HIPERTENSAO:
			return "Hipertensão";
		case TipoAnamnese.OBESIDADE:
			return "Obesidade";
		default:
			return "Desconhecido";
	}
}

export default interface Anamnese extends BaseModel {
	tipo: TipoAnamnese;
	idAluno: string;
	peso: number;
	altura: number;
	imc: number;
}
