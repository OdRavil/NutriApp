import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCol,
	IonContent,
	IonDatetime,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonNote,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToast,
	IonToolbar,
	useIonAlert,
	useIonRouter,
} from "@ionic/react";
import moment from "moment";
import firebase from "firebase/app";
import React, { useCallback, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { addOutline, arrowBackOutline, trashOutline } from "ionicons/icons";
import EscolaService from "../../services/EscolaService";
import Escola from "../../models/Escola";
import LoadingSpinner from "../../components/LoadingSpinner";
import Usuario, { Sexo, TipoUsuario } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useAuth } from "../../context/auth";

interface TelaUsuarioProps {
	idUsuario: string;
}

const TelaUsuario: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const match = useRouteMatch<TelaUsuarioProps>();
	const { idUsuario } = match.params;

	const { auth } = useAuth();

	const [usuario, setUsuario] = useState<Usuario>();

	const [showAlertDesativar, setShowAlertDesativar] = useState<boolean>(false);
	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dataNascimento, setDataNascimento] = useState<string>();
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);

	const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(
		TipoUsuario.PROFESSOR
	);
	const [listaEscola, setListaEscola] = useState<Escola[]>();

	const [confirmaRemoverEscola] = useIonAlert();

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const ativar = async () => {
		if (!usuario) return;
		try {
			usuario.status = true;
			await new UsuarioService().updateData(usuario.id!, { status: true });
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
			await new UsuarioService().updateData(usuario.id!, { status: false });
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
		if (!myusuario?.listaEscola) {
			setListaEscola([]);
			return;
		}
		new EscolaService().listar().then((escolas) => {
			setListaEscola(
				escolas.filter(
					(item) => item.status || myusuario.listaEscola!.includes(item.id!)
				)
			);
			if (!escolas || escolas.length === 0) {
				mostrarMensagemErro("Não existem turmas cadastradas.");
			}
		});
	}, []);

	const removerEscola = async (id: string) => {
		if (!id || !usuario) return;
		if (!usuario.listaEscola) usuario.listaEscola = [];
		try {
			usuario.listaEscola = usuario.listaEscola.filter((escola) => escola !== id);
			await new UsuarioService()
				.getCollectionRef()
				.doc(idUsuario)
				.update({ listaEscola: firebase.firestore.FieldValue.arrayRemove(id) });
			carregarEscola(usuario);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAdicionarEscola = async (id: string) => {
		if (!id || !usuario) return;
		if (!usuario.listaEscola) usuario.listaEscola = [];
		try {
			usuario.listaEscola = [...usuario.listaEscola, id];
			await new UsuarioService()
				.getCollectionRef()
				.doc(idUsuario)
				.update({ listaEscola: firebase.firestore.FieldValue.arrayUnion(id) });
			carregarEscola(usuario);
		} catch (error) {
			console.error(error);
		}
	};

	const handleConfirmaRemoverEscola = async (id: string) => {
		confirmaRemoverEscola({
			message: "Deseja remover escola?",
			buttons: [
				"Não",
				{
					text: "Sim",
					handler: () => removerEscola(id),
				},
			],
		});
	};

	useEffect(() => {
		if (!usuario) return;
		carregarEscola(usuario);
	}, [usuario, carregarEscola]);

	useEffect(() => {
		if (!idUsuario) return;
		new UsuarioService()
			.getById(idUsuario)
			.then((myUsuario) => setUsuario(myUsuario));
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
		setTipoUsuario(usuario?.tipo || TipoUsuario.PROFESSOR);
	}, [usuario]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => navigateBack()}>
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
								<IonLabel position="floating" className="icon-config">
									Nome
								</IonLabel>
								<IonInput
									className="input-config"
									value={nome}
									placeholder="Nome"
									onIonChange={(e) => setNome(e.detail.value!)}
								/>
							</IonItem>
							<IonItem>
								<IonLabel position="floating" className="icon-config">
									E-mail
								</IonLabel>
								<IonInput
									className="input-config"
									value={email}
									type="email"
									placeholder="E-mail"
									onIonChange={(e) => setEmail(e.detail.value!)}
									disabled
								/>
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonLabel position="floating" className="icon-config">
									Sexo
								</IonLabel>
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
								<IonLabel position="floating" className="icon-config">
									Data de nascimento
								</IonLabel>
								<IonDatetime
									value={dataNascimento}
									onIonChange={(e) => setDataNascimento(e.detail.value!)}
									displayFormat="DD/MM/YYYY"
									className="input-config"
									placeholder="Data de nascimento"
								/>
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonLabel position="floating" className="icon-config">
									Permissão
								</IonLabel>
								<IonSelect
									className="input-config"
									value={tipoUsuario}
									placeholder="Permissão"
									onIonChange={(e) => setTipoUsuario(e.detail.value)}
								>
									<IonSelectOption value={TipoUsuario.ADMINISTRADOR}>
										Administrador
									</IonSelectOption>
									<IonSelectOption value={TipoUsuario.NUTRICIONISTA}>
										Nutricionista
									</IonSelectOption>
									<IonSelectOption value={TipoUsuario.PROFESSOR}>
										Professor
									</IonSelectOption>
								</IonSelect>
							</IonItem>
						</IonList>
					)}
				</IonCard>
				{usuario && usuario.tipo !== TipoUsuario.ADMINISTRADOR && (
					<IonCard>
						<IonCardHeader>
							<IonCardSubtitle>Escolas</IonCardSubtitle>
						</IonCardHeader>
						{!listaEscola && <LoadingSpinner />}
						{listaEscola && listaEscola.length === 0 && (
							<IonList lines="none">
								<IonItem>
									<IonLabel>Nenhuma escola para este usuário</IonLabel>
								</IonItem>
							</IonList>
						)}
						{listaEscola && listaEscola.length !== 0 && (
							<IonList lines="none">
								{listaEscola.map((item, index) => (
									<IonItem
										key={item.id!}
										lines={index === listaEscola.length - 1 ? "none" : "full"}
									>
										<IonLabel slot="start" className="icon-config">
											{item.nome}
										</IonLabel>
										{!item.status && (
											<IonNote
												slot="end"
												style={{
													fontSize: "0.8rem",
												}}
												color="danger"
											>
												Inativo
											</IonNote>
										)}
										{usuario.listaEscola!.includes(item.id!) && (
											<IonButton
												fill="clear"
												slot="end"
												onClick={() => handleConfirmaRemoverEscola(item.id!)}
											>
												<IonIcon color="danger" src={trashOutline} />
											</IonButton>
										)}
										{!usuario.listaEscola!.includes(item.id!) && (
											<IonButton
												fill="clear"
												slot="end"
												onClick={() => handleAdicionarEscola(item.id!)}
											>
												<IonIcon color="danger" src={addOutline} />
											</IonButton>
										)}
									</IonItem>
								))}
							</IonList>
						)}
					</IonCard>
				)}
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								color="primary"
								expand="block"
								onClick={salvar}
								className="register-button"
								disabled={!usuario}
							>
								Salvar
							</IonButton>
						</IonCol>
					</IonRow>
					{usuario && auth?.user?.id !== usuario?.id && (
						<IonRow>
							<IonCol>
								<IonButton
									color="danger"
									expand="block"
									onClick={() =>
										usuario?.status ? setShowAlertDesativar(true) : ativar()
									}
									className="register-button"
									disabled={!usuario}
								>
									{usuario?.status ? "Desativar" : "Ativar"}
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

export default TelaUsuario;
