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
	IonTextarea,
	IonGrid,
	IonRow,
	IonCol,
	useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

// Import Icons
import { chevronBack } from "ionicons/icons";

// Import Components
import LoadingSpinner from "../../components/LoadingSpinner";

// Import Context
import { useAuth } from "../../context/auth";

// Import Models
import Aluno from "../../models/Aluno";
import AnamneseModel, {
	getTipoAnamneseText,
	TipoAnamnese,
} from "../../models/Anamnese";

// Import Services
import AlunoService from "../../services/AlunoService";
import AnamneseService from "../../services/AnamneseService";

// Import Utils
import { maskImc } from "../../utils/string";

const Anamnese: React.FC<RouteComponentProps> = () => {
	const router = useIonRouter();

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
	const [questaoPossuiHabitoSaudavel, setQuestaoPossuiHabitoSaudavel] =
		useState<string>("");
	const [questaoPossuiDoenca, setQuestaoPossuiDoenca] = useState<string>("");

	// DIABETES_METLITUS
	const [
		questaoPossuiPessoaComDiabetesNaFamilia,
		setQuestaoPossuiPessoaComDiabetesNaFamilia,
	] = useState<string>("");
	const [
		questaoQuantasVezesPorSemanaComeDoce,
		setQuestaoQuantasVezesPorSemanaComeDoce,
	] = useState<string>("");

	// HIPERTENSAO
	const [
		questaoPossuiPessoaComProblemaDeCoracao,
		setQuestaoPossuiPessoaComProblemaDeCoracao,
	] = useState<string>("");
	const [
		questaoPossuiHabitoDeAlimentosComMuitoSal,
		setQuestaoPossuiHabitoDeAlimentosComMuitoSal,
	] = useState<string>("");

	// OBESIDADE
	const [
		questaoPossuiHabitoDeBoaAlimentacao,
		setQuestaoPossuiHabitoDeBoaAlimentacao,
	] = useState<string>("");
	const [questaoEscalaSaudavel, setQuestaoEscalaSaudavel] = useState<number>(0);
	const [questaoOQueComeNoRecreio, setQuestaoOQueComeNoRecreio] =
		useState<string>("");
	const [
		questaoQuantasVezesComeAlimentosFritos,
		setQuestaoQuantasVezesComeAlimentosFritos,
	] = useState<string>("");

	const atualizar = () => {
		if (!anamnese || !aluno?.id) return;
		try {
			if (!aluno.dadosSaude) aluno.dadosSaude = {};

			aluno.dadosSaude.peso = Number(peso);
			aluno.dadosSaude.altura = Number(altura);
			aluno.dadosSaude.imc = Number(imc);
			aluno.dadosSaude.questaoPossuiHabitoSaudavel = questaoPossuiHabitoSaudavel;
			aluno.dadosSaude.questaoPossuiDoenca = questaoPossuiDoenca;

			if (anamnese.tipo === TipoAnamnese.DIABETES_METLITUS) {
				anamnese.questaoPossuiPessoaComDiabetesNaFamilia =
					questaoPossuiPessoaComDiabetesNaFamilia;
				anamnese.questaoQuantasVezesPorSemanaComeDoce =
					questaoQuantasVezesPorSemanaComeDoce;
			}

			if (anamnese.tipo === TipoAnamnese.HIPERTENSAO) {
				anamnese.questaoPossuiPessoaComProblemaDeCoracao =
					questaoPossuiPessoaComProblemaDeCoracao;
				anamnese.questaoPossuiHabitoDeAlimentosComMuitoSal =
					questaoPossuiHabitoDeAlimentosComMuitoSal;
			}

			if (anamnese.tipo === TipoAnamnese.OBESIDADE) {
				anamnese.questaoPossuiHabitoDeBoaAlimentacao =
					questaoPossuiHabitoDeBoaAlimentacao;
				anamnese.questaoEscalaSaudavel = questaoEscalaSaudavel;
				anamnese.questaoOQueComeNoRecreio = questaoOQueComeNoRecreio;
				anamnese.questaoQuantasVezesComeAlimentosFritos =
					questaoQuantasVezesComeAlimentosFritos;
			}

			const alunoService = new AlunoService();
			const anamneseService = new AnamneseService();
			const promises: Promise<any>[] = [];
			promises.push(alunoService.updateData(aluno.id, aluno));
			if (anamnese.id) {
				promises.push(anamneseService.updateData(anamnese.id, anamnese));
			} else {
				promises.push(anamneseService.pushData(anamnese));
			}
			Promise.all(promises).then(() => setShowSuccessBox(true));
		} catch (error) {
			console.error(error);
			setMensagemErrorBox("Erro no cadastro");
		}
	};

	const perguntasTipoDiabetesMetlitus = () => (
		<>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Tem alguma pessoa com diabetes na sua família?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config inputField">
				<IonTextarea
					className="input-config"
					value={questaoPossuiPessoaComDiabetesNaFamilia}
					onIonChange={(e) =>
						setQuestaoPossuiPessoaComDiabetesNaFamilia(e.detail.value!)
					}
				/>
			</IonItem>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Quantas vezes por semana você come doces?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config inputField">
				<IonTextarea
					className="input-config"
					value={questaoQuantasVezesPorSemanaComeDoce}
					onIonChange={(e) =>
						setQuestaoQuantasVezesPorSemanaComeDoce(e.detail.value!)
					}
				/>
			</IonItem>
		</>
	);

	const perguntasTipoHipertensao = () => (
		<>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Tem alguém na sua família com problemas no coração?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config">
				<IonTextarea
					className="input-config"
					value={questaoPossuiPessoaComProblemaDeCoracao}
					onIonChange={(e) =>
						setQuestaoPossuiPessoaComProblemaDeCoracao(e.detail.value!)
					}
				/>
			</IonItem>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Sua família tem o hábito de comer alimentos com muito sal?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config">
				<IonTextarea
					className="input-config"
					value={questaoPossuiHabitoDeAlimentosComMuitoSal}
					onIonChange={(e) =>
						setQuestaoPossuiHabitoDeAlimentosComMuitoSal(e.detail.value!)
					}
				/>
			</IonItem>
		</>
	);

	const perguntasTipoObesidade = () => (
		<>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Você tem o hábito de ter uma boa alimentação?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config">
				<IonTextarea
					className="input-config"
					value={questaoPossuiHabitoDeBoaAlimentacao}
					onIonChange={(e) =>
						setQuestaoPossuiHabitoDeBoaAlimentacao(e.detail.value!)
					}
				/>
			</IonItem>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Em uma escala de 0 a 10, quanto você se classificaria uma &quot;pessoa
					saudável&quot;?
				</IonLabel>
				<IonSelect
					className="input-config"
					value={questaoEscalaSaudavel}
					placeholder="Aluno"
					onIonChange={(e) => setQuestaoEscalaSaudavel(e.detail.value)}
				>
					<IonSelectOption value={0}>{0}</IonSelectOption>
					<IonSelectOption value={1}>{1}</IonSelectOption>
					<IonSelectOption value={2}>{2}</IonSelectOption>
					<IonSelectOption value={3}>{3}</IonSelectOption>
					<IonSelectOption value={4}>{4}</IonSelectOption>
					<IonSelectOption value={5}>{5}</IonSelectOption>
					<IonSelectOption value={6}>{6}</IonSelectOption>
					<IonSelectOption value={7}>{7}</IonSelectOption>
					<IonSelectOption value={8}>{8}</IonSelectOption>
					<IonSelectOption value={9}>{9}</IonSelectOption>
					<IonSelectOption value={10}>{10}</IonSelectOption>
				</IonSelect>
			</IonItem>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					O que você leva para comer na hora do recreio?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config">
				<IonTextarea
					className="input-config"
					value={questaoOQueComeNoRecreio}
					onIonChange={(e) => setQuestaoOQueComeNoRecreio(e.detail.value!)}
				/>
			</IonItem>
			<IonItem className="item-config" lines="none">
				<IonLabel className="ion-text-wrap">
					Quantas vezes por semana você come alimentos fritos?
				</IonLabel>
			</IonItem>
			<IonItem className="item-config">
				<IonTextarea
					className="input-config"
					value={questaoQuantasVezesComeAlimentosFritos}
					onIonChange={(e) =>
						setQuestaoQuantasVezesComeAlimentosFritos(e.detail.value!)
					}
				/>
			</IonItem>
		</>
	);

	useEffect(() => {
		setPeso(aluno?.dadosSaude?.peso ? String(aluno?.dadosSaude.peso) : "0");
		setAltura(aluno?.dadosSaude?.altura ? String(aluno?.dadosSaude.altura) : "0");

		setQuestaoPossuiHabitoSaudavel(
			aluno?.dadosSaude?.questaoPossuiHabitoSaudavel || ""
		);
		setQuestaoPossuiDoenca(aluno?.dadosSaude?.questaoPossuiDoenca || "");
	}, [aluno]);

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
		setQuestaoPossuiPessoaComDiabetesNaFamilia(
			anamnese?.questaoPossuiPessoaComDiabetesNaFamilia || ""
		);
		setQuestaoQuantasVezesPorSemanaComeDoce(
			anamnese?.questaoQuantasVezesPorSemanaComeDoce || ""
		);

		setQuestaoPossuiPessoaComProblemaDeCoracao(
			anamnese?.questaoPossuiPessoaComProblemaDeCoracao || ""
		);
		setQuestaoPossuiHabitoDeAlimentosComMuitoSal(
			anamnese?.questaoPossuiHabitoDeAlimentosComMuitoSal || ""
		);

		setQuestaoPossuiHabitoDeBoaAlimentacao(
			anamnese?.questaoPossuiHabitoDeBoaAlimentacao || ""
		);
		setQuestaoEscalaSaudavel(anamnese?.questaoEscalaSaudavel || 0);
		setQuestaoOQueComeNoRecreio(anamnese?.questaoOQueComeNoRecreio || "");
		setQuestaoQuantasVezesComeAlimentosFritos(
			anamnese?.questaoQuantasVezesComeAlimentosFritos || ""
		);
	}, [anamnese]);

	useEffect(() => {
		if (!auth?.user?.listaEscola) return;
		new AlunoService()
			.listarPorEscola(auth.user.listaEscola)
			.then((lista) => setAlunos(lista));
	}, [auth?.user?.listaEscola]);

	useEffect(() => {
		const nPeso = Number(peso);
		const nAltura = Number(altura) / 100;
		let nImc = nPeso / (nAltura * nAltura);
		if (Number.isNaN(nImc) || !Number.isFinite(nImc)) {
			nImc = 0;
		}
		setImc(nImc.toFixed(2).toString());
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
								router.canGoBack();
								router.goBack();
							}}
						/>
					</IonButtons>
					<IonTitle>Anamnese</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonCard>
					<IonList lines="none">
						<IonLabel className="icon-config m-l-10">Aluno</IonLabel>
						<IonItem className="item-config inputField">
							<IonSelect
								// disabled={showAnamnese}
								className="input-config w-100"
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
						<IonLabel className="icon-config m-l-10">Anamnese</IonLabel>
						<IonItem className="item-config inputField">
							<IonSelect
								className="input-config w-100"
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
					</IonList>
				</IonCard>
				{aluno && !anamnese && <LoadingSpinner />}
				<div className={showAnamnese ? "" : "ion-hide"}>
					<IonCard>
						<IonList>
							<IonItem>
								<IonLabel className="icon-config">Peso(kg)</IonLabel>
								<IonInput
									slot="end"
									className="input-config"
									value={peso}
									inputMode="decimal"
									type="number"
									onIonChange={(e) => setPeso(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel className="icon-config">Altura(cm)</IonLabel>
								<IonInput
									slot="end"
									className="input-config"
									value={altura}
									inputMode="decimal"
									type="number"
									onIonChange={(e) => setAltura(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel className="icon-config">IMC</IonLabel>
								<IonInput slot="end" value={maskImc(imc)} readonly />
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonLabel className="ion-text-wrap">
									Possui um hábito saudável? Se sim, qual?
								</IonLabel>
							</IonItem>
							<IonItem className="item-config inputField">
								<IonTextarea
									className="input-config"
									value={questaoPossuiHabitoSaudavel}
									onIonChange={(e) => setQuestaoPossuiHabitoSaudavel(e.detail.value!)}
								/>
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonLabel className="ion-text-wrap">
									Possui alguma doença? Se sim, qual?
								</IonLabel>
							</IonItem>
							<IonItem className="item-config inputField">
								<IonTextarea
									className="input-config"
									value={questaoPossuiDoenca}
									onIonChange={(e) => setQuestaoPossuiDoenca(e.detail.value!)}
								/>
							</IonItem>
							{anamnese &&
								anamnese.tipo === TipoAnamnese.DIABETES_METLITUS &&
								perguntasTipoDiabetesMetlitus()}
							{anamnese &&
								anamnese.tipo === TipoAnamnese.HIPERTENSAO &&
								perguntasTipoHipertensao()}
							{anamnese &&
								anamnese.tipo === TipoAnamnese.OBESIDADE &&
								perguntasTipoObesidade()}
						</IonList>
					</IonCard>
				</div>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								color="primary"
								expand="block"
								onClick={atualizar}
								className="register-button"
							>
								Atualizar
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
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
					message="Atualizado."
					duration={700}
					color="success"
					position="top"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Anamnese;
