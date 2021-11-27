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
import EscolaService from "../../services/EscolaService";
import Escola from "../../models/Escola";
import LoadingSpinner from "../../components/LoadingSpinner";
import Usuario, { Sexo, TipoUsuario } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useAuth } from "../../context/auth";

interface TelaUsuarioProps {
	idUsuario: string;
}

const TelaUsuario: React.FC<RouteComponentProps<TelaUsuarioProps>> = (
	props
) => {
	const { auth } = useAuth();

	const { idUsuario } = props.match.params;
	const [usuario, setUsuario] = useState<Usuario>();

	const [showAlertDesativar, setShowAlertDesativar] = useState<boolean>(false);
	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dataNascimento, setDataNascimento] = useState<string>();
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);

	const [tipoUsuario] = useState<TipoUsuario>(TipoUsuario.PROFESSOR);
	const [, setListaEscola] = useState<Escola[]>();

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const ativar = async () => {
		if (!usuario) return;
		try {
			usuario.status = true;
			await new UsuarioService().updateData(usuario.id!, usuario);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const desativar = async () => {
		if (!usuario) return;
		try {
			usuario.status = false;
			await new UsuarioService().updateData(usuario.id!, usuario);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const salvar = async () => {
		if (!usuario) return;
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
		if (!tipoUsuario || tipoUsuario.trim().length === 0) {
			mostrarMensagemErro("Turma não selecionada.");
			return;
		}

		try {
			usuario.nome = nome;
			usuario.email = email;
			usuario.sexo = sexo;
			usuario.tipo = tipoUsuario;
			await new UsuarioService().updateData(usuario.id!, usuario);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	const carregarEscola = useCallback(async (myusuario: Usuario) => {
		if (myusuario.tipo === TipoUsuario.ADMINISTRADOR) {
			new EscolaService().listar().then((escolas) => {
				setListaEscola(escolas);
				if (!escolas || escolas.length === 0) {
					mostrarMensagemErro("Não existem turmas cadastradas.");
				}
			});
		} else {
			const escolasUsuario = myusuario.listaEscola;
			if (!escolasUsuario || escolasUsuario.length === 0) {
				setListaEscola([]);
				mostrarMensagemErro("Não existem turmas para este usuário.");
			}
			/* // Apenas as turmas que o usuário possui acesso
			new TurmaService().listarPorEscola(escolasUsuario).then((turmas) => {
				setTurmaLista(turmas);
				if (!turmas || turmas.length === 0) {
					mostrarMensagemErro("Não existem turmas para este usuário.");
				}
			}); */
		}
	}, []);

	useEffect(() => {
		if (!auth?.user?.id) return;
		new UsuarioService()
			.getById(auth.user.id)
			.then((myusuario) => carregarEscola(myusuario!));
	}, [auth?.user?.id, carregarEscola]);

	useEffect(() => {
		if (!idUsuario) return;
		new UsuarioService().getById(idUsuario).then((myUsuario) => {
			setUsuario(myUsuario);

			/* if (myUsuario?.tipoUsuario) {
				new TurmaService().getById(myUsuario?.tipoUsuario).then((myTurma) => {
					setIdTurma(myTurma?.id);
				});
			} */
		});
	}, [idUsuario]);

	useEffect(() => {
		setNome(usuario?.nome || "");
		setEmail(usuario?.email || "");
		setDataNascimento(
			usuario?.dataNascimento
				? moment(usuario.dataNascimento.toDate()).format("DD/MM/YYYY")
				: ""
		);
		setSexo(usuario?.sexo || Sexo.MASCULINO);
	}, [usuario]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Usuario</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonAlert
				isOpen={showAlertDesativar}
				onDidDismiss={() => setShowAlertDesativar(false)}
				message={`Deseja realmente desativar o usuario ${usuario?.nome}?`}
				buttons={[
					{ text: "Cancelar", role: "cancel" },
					{ text: "Desativar", handler: () => desativar() },
				]}
			/>
			<IonContent fullscreen className="ion-padding">
				<IonCard>
					{!usuario && <LoadingSpinner />}
					{usuario && (
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
						</IonList>
					)}
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={salvar}
						className="register-button"
						disabled={!usuario}
					>
						Salvar
					</IonButton>
				</IonCard>
				<IonCard>
					<IonButton
						color="danger"
						expand="block"
						onClick={() => (usuario?.status ? setShowAlertDesativar(true) : ativar())}
						className="register-button"
						disabled={!usuario}
					>
						{usuario?.status ? "Desativar" : "Ativar"}
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

export default TelaUsuario;
