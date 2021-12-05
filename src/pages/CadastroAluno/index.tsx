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
	IonIcon,
	IonSelectOption,
	IonDatetime,
	IonLoading,
	IonButtons,
	IonGrid,
	IonRow,
	IonCol,
	useIonRouter,
} from "@ionic/react";
import {
	calendarOutline,
	chevronBack,
	mailOutline,
	maleFemaleOutline,
	personOutline,
} from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";
import Aluno from "../../models/Aluno";
import Usuario, { Sexo, TipoUsuario } from "../../models/Usuario";
import AlunoService from "../../services/AlunoService";
import "firebase/firestore";
import TurmaService from "../../services/TurmaService";
import Turma from "../../models/Turma";
import UsuarioService from "../../services/UsuarioService";
import { useAuth } from "../../context/auth";
import Escola from "../../models/Escola";
import EscolaService from "../../services/EscolaService";

const CadastroAluno: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const { auth } = useAuth();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dataNascimento, setDataNascimento] = useState<string>();
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);
	const [idTurma, setIdTurma] = useState<string>();
	const [turmaLista, setTurmaLista] = useState<Turma[]>();
	const [listaEscolas, setListaEscolas] = useState<Escola[]>([]);

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const carregarTurma = useCallback(async (usuario: Usuario) => {
		const escolaService = new EscolaService();
		if (usuario.tipo === TipoUsuario.ADMINISTRADOR) {
			await escolaService.listar().then((escolas) => setListaEscolas(escolas));
			new TurmaService().listar().then((turmas) => {
				setTurmaLista(turmas);
				if (!turmas || turmas.length === 0) {
					mostrarMensagemErro("Não existem turmas cadastradas.");
				}
			});
		} else {
			const escolasUsuario = usuario.listaEscola;
			if (!escolasUsuario || escolasUsuario.length === 0) {
				setTurmaLista([]);
				mostrarMensagemErro("Não existem turmas para este usuário.");
				return;
			}
			const promises: Promise<Escola | undefined>[] = [];
			escolasUsuario.forEach((item) => {
				promises.push(escolaService.getById(item));
			});
			await Promise.all(promises)
				.then((escolas) => {
					setListaEscolas(
						escolas.filter((item) => typeof item !== "undefined") as Escola[]
					);
				})
				.catch((error) => {
					console.error(error);
					setListaEscolas([]);
				});
			// Apenas as turmas que o usuário possui acesso
			new TurmaService().listarPorEscola(escolasUsuario).then((turmas) => {
				setTurmaLista(turmas);
				if (!turmas || turmas.length === 0) {
					mostrarMensagemErro("Não existem turmas para este usuário.");
				}
			});
		}
	}, []);

	const cadastrar = async () => {
		if (!nome || nome.trim().length === 0) {
			mostrarMensagemErro("Nome não preenchido.");
			return;
		}
		if (!email || email.trim().length === 0) {
			mostrarMensagemErro("E-mail não preenchido.");
			return;
		}
		if (!sexo || sexo.trim().length === 0) {
			mostrarMensagemErro("Sexo não preenchido.");
			return;
		}
		if (!idTurma || idTurma.trim().length === 0) {
			mostrarMensagemErro("Turma não selecionada.");
			return;
		}

		try {
			const aluno: Aluno = {
				nome: nome.trim(),
				email: email.trim(),
				sexo,
				dataNascimento: dataNascimento
					? firebase.firestore.Timestamp.fromDate(new Date(dataNascimento))
					: undefined,
				idTurma,
			};
			await new AlunoService().pushData(aluno);
			setNome("");
			setEmail("");
			setDataNascimento("");
			setSexo(Sexo.MASCULINO);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const getTurmaSelectItemText = (turma: Turma) => {
		const escola = listaEscolas.find((item) => item.id! === turma.idEscola)?.nome;
		if (escola) return `${turma.codigo} - ${escola}`;
		return turma.codigo;
	};

	useEffect(() => {
		if (!auth?.user?.id) return;
		new UsuarioService()
			.getById(auth.user.id)
			.then((usuario) => carregarTurma(usuario!));
	}, [auth?.user?.id, carregarTurma]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonIcon icon={chevronBack} size="large" onClick={() => navigateBack()} />
					</IonButtons>
					<IonTitle>Cadastro de Aluno</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding" fullscreen scrollY={false}>
				<IonLoading isOpen={!turmaLista} />
				<IonCard>
					<IonList lines="none">
						<IonItem>
							<IonIcon className="icon-config" icon={personOutline} />
							<IonInput
								className="input-config"
								value={nome}
								placeholder="Nome"
								onIonChange={(e) => setNome(e.detail.value!)}
							/>
						</IonItem>
						<IonItem>
							<IonIcon className="icon-config" icon={mailOutline} />
							<IonInput
								className="input-config"
								value={email}
								type="email"
								placeholder="E-mail"
								onIonChange={(e) => setEmail(e.detail.value!)}
							/>
						</IonItem>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={maleFemaleOutline} />
							<IonSelect
								className="input-config"
								value={sexo}
								placeholder="Sexo"
								onIonChange={(e) => setSexo(e.detail.value)}
							>
								<IonSelectOption value={Sexo.FEMININO}>Feminino</IonSelectOption>
								<IonSelectOption value={Sexo.MASCULINO}>Masculino</IonSelectOption>
							</IonSelect>
						</IonItem>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={calendarOutline} />
							<IonDatetime
								value={dataNascimento}
								onIonChange={(e) => setDataNascimento(e.detail.value!)}
								displayFormat="DD/MM/YYYY"
								className="input-config"
								placeholder="Data de nascimento"
							/>
						</IonItem>
						{turmaLista && (
							<IonItem className="item-config" lines="none">
								<IonSelect
									className="input-config"
									value={idTurma}
									placeholder="Turma"
									onIonChange={(e) => setIdTurma(e.detail.value)}
								>
									{turmaLista.map((item) => (
										<IonSelectOption key={item.id!} value={item.id!}>
											{getTurmaSelectItemText(item)}
										</IonSelectOption>
									))}
								</IonSelect>
							</IonItem>
						)}
					</IonList>
				</IonCard>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								color="primary"
								expand="block"
								onClick={cadastrar}
								className="register-button"
								disabled={!turmaLista || turmaLista.length === 0}
							>
								Cadastrar
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
					message="Cadastrado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default CadastroAluno;
