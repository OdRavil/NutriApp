import {
	IonButton,
	IonCard,
	IonContent,
	IonHeader,
	IonInput,
	IonItem,
	IonPage,
	IonTitle,
	IonToolbar,
	IonToast,
	IonList,
	IonSelect,
	IonSelectOption,
	IonLabel,
	IonButtons,
	IonIcon,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/auth";
import Aluno from "../../models/Aluno";
import AnamneseModel, {
	getTipoAnamneseText,
	TipoAnamnese,
} from "../../models/Anamnese";
import AlunoService from "../../services/AlunoService";
import AnamneseService from "../../services/AnamneseService";
import { maskImc } from "../../utils/string";

const Anamnese: React.FC<RouteComponentProps> = ({ history }) => {
	const { auth } = useAuth();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [showAnamnese, setShowAnamnese] = useState<boolean>(false);
	const [alunos, setAlunos] = useState<Aluno[]>();
	const [aluno, setAluno] = useState<Aluno>();
	const [anamnese, setAnamnese] = useState<AnamneseModel>();
	const [tipoAnamnese, setTipoAnamnese] = useState<TipoAnamnese>(
		TipoAnamnese.DIABETES_METLITUS
	);

	const [peso, setPeso] = useState<string>("0");
	const [altura, setAltura] = useState<string>("0");
	const [imc, setImc] = useState<string>("0");

	const atualizar = () => {
		if (!anamnese) return;
		try {
			console.error("Atualizado");
			anamnese.peso = Number(peso);
			anamnese.altura = Number(altura);
			anamnese.imc = Number(imc);
			const anamneseService = new AnamneseService();
			if (anamnese.id) {
				anamneseService.updateData(anamnese.id, anamnese);
			} else {
				anamneseService.pushData(anamnese);
			}
		} catch (error) {
			console.error(error);
			setMensagemErrorBox("Erro no cadastro");
		}
	};

	useEffect(() => {
		if (typeof aluno === "undefined") {
			setShowAnamnese(false);
			return;
		}
		const anamneseService = new AnamneseService();
		anamneseService.listarPorAlunoTipo(aluno.id!, tipoAnamnese).then((result) => {
			if (typeof result === "undefined") {
				result = {
					idAluno: aluno.id!,
					tipo: tipoAnamnese,
				} as any;
			}
			setAnamnese(result);
		});
		setShowAnamnese(true);
	}, [aluno, tipoAnamnese]);

	useEffect(() => {
		setPeso(anamnese && anamnese.peso ? String(anamnese.peso) : "0");
		setAltura(anamnese && anamnese.altura ? String(anamnese.altura) : "0");
	}, [anamnese]);

	useEffect(() => {
		if (!auth?.user?.listaEscola) return;
		new AlunoService()
			.listarPorEscola(auth.user.listaEscola)
			.then((lista) => setAlunos(lista));
	}, [auth?.user?.listaEscola]);

	useEffect(() => {
		const nPeso = Number(peso);
		const nAltura = Number(altura);
		let nImc = nPeso / (nAltura * nAltura);
		if (Number.isNaN(nImc) || !Number.isFinite(nImc)) {
			nImc = 0;
		}
		setImc(String(nImc.toPrecision(4)));
	}, [peso, altura]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonIcon
							icon={chevronBack}
							size="large"
							onClick={() => {
								history.goBack();
							}}
						/>
					</IonButtons>
					<IonTitle>Anamnese</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen scrollY={false}>
				<IonCard>
					<IonList lines="none">
						<IonItem className="item-config" lines="none">
							<IonLabel className="icon-config">Aluno</IonLabel>
							<IonSelect
								disabled={showAnamnese}
								className="input-config"
								value={aluno}
								placeholder="Aluno"
								onIonChange={(e) => setAluno(e.detail.value)}
							>
								{alunos &&
									alunos.map((item) => (
										<IonSelectOption value={item}>{item.nome}</IonSelectOption>
									))}
							</IonSelect>
						</IonItem>
						<IonItem className="item-config" lines="none">
							<IonLabel className="icon-config">Anamnese</IonLabel>
							<IonSelect
								className="input-config"
								value={tipoAnamnese}
								placeholder="Anamnese"
								onIonChange={(e) => setTipoAnamnese(e.detail.value)}
							>
								<IonSelectOption value={TipoAnamnese.DIABETES_METLITUS}>
									{getTipoAnamneseText(TipoAnamnese.DIABETES_METLITUS)}
								</IonSelectOption>
								<IonSelectOption value={TipoAnamnese.HIPERTENSAO}>
									{getTipoAnamneseText(TipoAnamnese.HIPERTENSAO)}
								</IonSelectOption>
								<IonSelectOption value={TipoAnamnese.OBESIDADE}>
									{getTipoAnamneseText(TipoAnamnese.OBESIDADE)}
								</IonSelectOption>
							</IonSelect>
						</IonItem>
						<div className={showAnamnese ? "" : "ion-hide"}>
							<IonItem>
								<IonLabel className="icon-config">Peso</IonLabel>
								<IonInput
									className="input-config"
									value={peso}
									inputMode="decimal"
									type="number"
									onIonChange={(e) => setPeso(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel className="icon-config">Altura</IonLabel>
								<IonInput
									className="input-config"
									value={altura}
									inputMode="decimal"
									type="number"
									onIonChange={(e) => setAltura(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel className="icon-config">IMC</IonLabel>
								<IonLabel className="icon-config">{maskImc(imc)}</IonLabel>
							</IonItem>
						</div>
					</IonList>
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={atualizar}
						className="register-button"
					>
						Atualizar
					</IonButton>
				</IonCard>
				<IonToast
					isOpen={showErrorBox}
					onDidDismiss={() => setShowErrorBox(false)}
					message={mensagemErrorBox}
					duration={1000}
					position="top"
					color="danger"
				/>

				<IonToast
					isOpen={showSuccessBox}
					onDidDismiss={() => setShowSuccessBox(false)}
					message="Cadastrado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Anamnese;
