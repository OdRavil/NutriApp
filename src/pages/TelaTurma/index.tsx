import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import TurmaService from "../../services/TurmaService";
import Turma from "../../models/Turma";
import LoadingSpinner from "../../components/LoadingSpinner";
import Escola from "../../models/Escola";
import { useAuth } from "../../context/auth";
import UsuarioService from "../../services/UsuarioService";
import EscolaService from "../../services/EscolaService";
import Usuario, { TipoUsuario } from "../../models/Usuario";
import AlunoService from "../../services/AlunoService";

interface TelaTurmaProps {
	idTurma: string;
}

const TelaTurma: React.FC<RouteComponentProps<TelaTurmaProps>> = (props) => {
	const { auth } = useAuth();

	const { idTurma } = props.match.params;
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
						<IonButton onClick={() => props.history.goBack()}>
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
							<IonItem>
								<IonLabel position="floating" className="icon-config">
									Código
								</IonLabel>
								<IonInput
									className="input-config"
									value={codigo}
									placeholder="Código"
									onIonChange={(e) => setCodigo(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel position="floating" className="icon-config">
									Descrição
								</IonLabel>
								<IonTextarea
									className="input-config"
									value={descricao}
									placeholder="Descrição"
									onIonChange={(e) => setDescricao(e.detail.value!)}
								/>
							</IonItem>
							{escolaLista && (
								<IonItem className="item-config" lines="none">
									<IonLabel position="floating" className="icon-config">
										Escola
									</IonLabel>
									<IonSelect
										className="input-config"
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
						disabled={!turma}
					>
						Salvar
					</IonButton>
				</IonCard>
				<IonCard>
					<IonButton
						color="danger"
						expand="block"
						onClick={() => (turma?.status ? setShowAlertDesativar(true) : ativar())}
						className="register-button"
						disabled={!turma}
					>
						{turma?.status ? "Desativar" : "Ativar"}
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

export default TelaTurma;
