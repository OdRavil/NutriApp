import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToast,
	IonToolbar,
	useIonRouter,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

// Import Icons
import { arrowBackOutline } from "ionicons/icons";

// Import Services
import TurmaService from "../../services/TurmaService";
import UsuarioService from "../../services/UsuarioService";
import EscolaService from "../../services/EscolaService";
import AlunoService from "../../services/AlunoService";

// Import Models
import Turma from "../../models/Turma";
import Escola from "../../models/Escola";
import Usuario, { TipoUsuario } from "../../models/Usuario";

// Import Componentes
import LoadingSpinner from "../../components/LoadingSpinner";

// Import Context
import { useAuth } from "../../context/auth";

interface TelaTurmaProps {
	idTurma: string;
}

const TelaTurma: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const match = useRouteMatch<TelaTurmaProps>();
	const { idTurma } = match.params;

	const { auth } = useAuth();

	const [turma, setTurma] = useState<Turma>();

	const [showAlertDesativar, setShowAlertDesativar] = useState<boolean>(false);
	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [codigo, setCodigo] = useState<string>("");
	const [descricao, setDescricao] = useState<string>("");
	const [idEscola, setIdEscola] = useState<string>();
	const [escolaLista, setEscolaLista] = useState<Escola[]>();

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const carregarEscola = useCallback(async (usuario: Usuario) => {
		if (usuario.tipo === TipoUsuario.ADMINISTRADOR) {
			new EscolaService().listar().then((escolas) => {
				setEscolaLista(escolas);
				if (!escolas || escolas.length === 0) {
					mostrarMensagemErro("Não existem escolas cadastradas.");
				}
			});
		} else {
			const escolasUsuario = usuario.listaEscola;
			if (!escolasUsuario || escolasUsuario.length === 0) {
				setEscolaLista([]);
				mostrarMensagemErro("Não existem escolas para este usuário.");
				return;
			}
			// Apenas as escolas que o usuário possui acesso
			new EscolaService().listar().then((escolas) => {
				const filtrado = escolas.filter((item) =>
					escolasUsuario.includes(item.id!)
				);
				setEscolaLista(filtrado);
				if (!filtrado || filtrado.length === 0) {
					mostrarMensagemErro("Não existem escolas para este usuário.");
				}
			});
		}
	}, []);

	const ativar = async () => {
		if (!turma) return;
		try {
			turma.status = true;
			await new TurmaService().updateData(turma.id!, { status: true });
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const desativar = async () => {
		if (!turma) return;
		try {
			const alunos = await (
				await new AlunoService().listarPorTurma([turma.id!])
			).filter((aluno) => !!aluno.status);

			if (alunos.length !== 0) {
				mostrarMensagemErro(
					"Não é possível desativar uma turma com alunos ativos."
				);
				return;
			}
			turma.status = false;
			await new TurmaService().updateData(turma.id!, { status: false });
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const salvar = async () => {
		if (!turma) return;
		if (!codigo || codigo.trim().length === 0) {
			mostrarMensagemErro("Nome não preenchido.");
			return;
		}
		if (!descricao || descricao.trim().length === 0) {
			mostrarMensagemErro("Descrição não preenchida.");
			return;
		}
		if (!idEscola || idEscola.trim().length === 0) {
			mostrarMensagemErro("Escola não selecionada.");
			return;
		}

		try {
			turma.codigo = codigo;
			turma.descricao = descricao;
			turma.idEscola = idEscola;
			await new TurmaService().updateData(turma.id!, turma);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	useEffect(() => {
		if (!idTurma) return;
		new TurmaService()
			.getById(idTurma)
			.then((myTurma) => {
				setTurma(myTurma);
			})
			.catch((error) => {
				console.error(error);
				mostrarMensagemErro("Ocorreu um erro ao carregar turma.");
			});
	}, [idTurma]);

	useEffect(() => {
		if (!auth?.user?.id) return;
		new UsuarioService()
			.getById(auth.user.id)
			.then((usuario) => carregarEscola(usuario!));
	}, [auth?.user?.id, carregarEscola]);

	useEffect(() => {
		setCodigo(turma?.codigo || "");
		setDescricao(turma?.descricao || "");
		setIdEscola(turma?.idEscola || "");
	}, [turma]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => navigateBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Turma</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonAlert
				isOpen={showAlertDesativar}
				onDidDismiss={() => setShowAlertDesativar(false)}
				message={`Deseja realmente desativar a turma ${turma?.codigo}?`}
				buttons={[
					{ text: "Cancelar", role: "cancel" },
					{ text: "Desativar", handler: () => desativar() },
				]}
			/>
			<IonContent fullscreen className="ion-padding">
				<IonCard>
					{!turma && <LoadingSpinner />}
					{turma && (
						<IonList lines="none">
							<IonLabel position="floating" className="icon-config m-l-10">
								Código
							</IonLabel>
							<IonItem className="inputField m-10">
								<IonInput
									className="input-config"
									value={codigo}
									placeholder="Código"
									onIonChange={(e) => setCodigo(e.detail.value!)}
								/>
							</IonItem>
							<IonLabel position="floating" className="icon-config m-l-10">
								Descrição
							</IonLabel>
							<IonItem className="inputField m-10">
								<IonTextarea
									className="input-config"
									value={descricao}
									placeholder="Descrição"
									onIonChange={(e) => setDescricao(e.detail.value!)}
								/>
							</IonItem>
							{escolaLista && (
								<>
									<IonLabel position="floating" className="icon-config m-l-10">
										Escola
									</IonLabel>
									<IonItem className="item-config inputField m-10" lines="none">
										<IonSelect
											className="input-config w-100"
											value={idEscola}
											placeholder="Escola"
											onIonChange={(e) => setIdEscola(e.detail.value)}
										>
											{escolaLista.map((item) => (
												<IonSelectOption key={item.id!} value={item.id!}>
													{item.nome}
												</IonSelectOption>
											))}
										</IonSelect>
									</IonItem>
								</>
							)}
						</IonList>
					)}
				</IonCard>
				<IonGrid>
					{[TipoUsuario.ADMINISTRADOR, TipoUsuario.NUTRICIONISTA].includes(
						auth?.user?.tipo
					) && (
						<IonRow>
							{[TipoUsuario.ADMINISTRADOR, TipoUsuario.NUTRICIONISTA].includes(
								auth?.user?.tipo
							) && (
								<IonCol>
									<IonButton
										color="danger"
										expand="block"
										onClick={() =>
											turma?.status ? setShowAlertDesativar(true) : ativar()
										}
										className="register-button"
										disabled={!turma}
									>
										{turma?.status ? "Desativar" : "Ativar"}
									</IonButton>
								</IonCol>
							)}
							<IonCol>
								<IonButton
									color="primary"
									expand="block"
									onClick={salvar}
									className="register-button"
									disabled={!turma}
								>
									Salvar
								</IonButton>
							</IonCol>
						</IonRow>
					)}
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
					message="Alterado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default TelaTurma;
