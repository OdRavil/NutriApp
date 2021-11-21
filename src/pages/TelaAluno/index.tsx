/* eslint-disable no-undef */
import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonContent,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonList,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import {
	arrowBackOutline,
	calendarOutline,
	mailOutline,
	maleFemaleOutline,
	personOutline,
} from "ionicons/icons";
import TurmaService from "../../services/TurmaService";
import AlunoService from "../../services/AlunoService";
import Aluno from "../../models/Aluno";
import Turma from "../../models/Turma";
import LoadingSpinner from "../../components/LoadingSpinner";
import Usuario, { Sexo, TipoUsuario } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useAuth } from "../../context/auth";

interface TelaAlunoProps {
	idAluno: string;
}

const TelaAluno: React.FC<RouteComponentProps<TelaAlunoProps>> = (props) => {
	const { auth } = useAuth();

	const { idAluno } = props.match.params;
	const [aluno, setAluno] = useState<Aluno>();

	const [showAlertDesativar, setShowAlertDesativar] = useState<boolean>(false);
	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dataNascimento, setDataNascimento] = useState<string>();
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);

	const [idTurma, setIdTurma] = useState<string>();
	const [turmaLista, setTurmaLista] = useState<Turma[]>();

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const ativar = async () => {
		if (!aluno) return;
		try {
			aluno.status = true;
			await new AlunoService().updateData(aluno.id!, aluno);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const desativar = async () => {
		if (!aluno) return;
		try {
			aluno.status = false;
			await new AlunoService().updateData(aluno.id!, aluno);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const salvar = async () => {
		if (!aluno) return;
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
			aluno.nome = nome;
			aluno.email = email;
			aluno.sexo = sexo;
			aluno.idTurma = idTurma;
			await new AlunoService().updateData(aluno.id!, aluno);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const carregarTurma = useCallback(async (usuario: Usuario) => {
		if (usuario.tipo === TipoUsuario.ADMINISTRADOR) {
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
			// Apenas as turmas que o usuário possui acesso
			new TurmaService().listarPorEscola(escolasUsuario).then((turmas) => {
				setTurmaLista(turmas);
				if (!turmas || turmas.length === 0) {
					mostrarMensagemErro("Não existem turmas para este usuário.");
				}
			});
		}
	}, []);

	useEffect(() => {
		if (!auth?.user?.id) return;
		new UsuarioService()
			.getById(auth.user.id)
			.then((usuario) => carregarTurma(usuario!));
	}, [auth?.user?.id, carregarTurma]);

	useEffect(() => {
		if (!idAluno) return;
		new AlunoService().getById(idAluno).then((myAluno) => {
			setAluno(myAluno);

			if (myAluno?.idTurma) {
				new TurmaService().getById(myAluno?.idTurma).then((myTurma) => {
					setIdTurma(myTurma?.id);
				});
			}
		});
	}, [idAluno]);

	useEffect(() => {
		setNome(aluno?.nome || "");
		setEmail(aluno?.email || "");
		setDataNascimento(
			aluno?.dataNascimento
				? moment(aluno.dataNascimento.toDate()).format("DD/MM/YYYY")
				: ""
		);
		setSexo(aluno?.sexo || Sexo.MASCULINO);
	}, [aluno]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Aluno</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonAlert
				isOpen={showAlertDesativar}
				onDidDismiss={() => setShowAlertDesativar(false)}
				message={`Deseja realmente desativar o aluno ${aluno?.nome}?`}
				buttons={[
					{ text: "Cancelar", role: "cancel" },
					{ text: "Desativar", handler: () => desativar() },
				]}
			/>
			<IonContent fullscreen className="ion-padding">
				<IonCard>
					{!aluno && <LoadingSpinner />}
					{aluno && (
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
												{item.codigo}
											</IonSelectOption>
										))}
									</IonSelect>
								</IonItem>
							)}
						</IonList>
					)}
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={salvar}
						className="register-button"
						disabled={!aluno}
					>
						Salvar
					</IonButton>
				</IonCard>
				<IonCard>
					<IonButton
						color="danger"
						expand="block"
						onClick={() => (aluno?.status ? setShowAlertDesativar(true) : ativar())}
						className="register-button"
						disabled={!aluno}
					>
						{aluno?.status ? "Desativar" : "Ativar"}
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
					message="Alterado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default TelaAluno;
