import {
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
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import { chevronBack, keyOutline, mailOutline } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import "./index.css";
import firebase from "firebase/app";
import "firebase/auth";
import UsuarioService from "../../services/UsuarioService";
import Usuario from "../../models/Usuario";
import { loginUser } from "../../utils/Firebase";

const usuarioService = new UsuarioService();

const PrimeiroAcesso: React.FC<RouteComponentProps> = (props) => {
	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [mensagemSuccessBox, setMensagemSuccessBox] = useState<string>("");
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [showFinalizarCadastro, setFinalizarCadastro] = useState<boolean>(false);
	const [usuario, setUsuario] = useState<Usuario>();
	const [email, setEmail] = useState<string>("");
	const [senha, setSenha] = useState<string>("");

	const mostrarMensagemSucesso = (mensagem: string) => {
		setMensagemSuccessBox(mensagem);
		setShowSuccessBox(true);
	};

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const clear = () => {
		setEmail("");
		setSenha("");
		setFinalizarCadastro(false);
	};

	const acessar = async () => {
		if (!usuario) return;
		if (!senha || senha.trim().length === 0) {
			mostrarMensagemErro("Senha não preenchida.");
			return;
		}
		if (senha.trim().length < 6) {
			mostrarMensagemErro("Senha deve ter no mínimo 6 caracteres.");
			return;
		}

		firebase
			.auth()
			.createUserWithEmailAndPassword(email, senha)
			.then((credentials) => {
				if (!credentials.user) {
					mostrarMensagemErro(
						"Erro ao cadastrar usuário.\nUsuário não cadastrado no Autenticador."
					);
				}
				const id = credentials.user!.uid;
				usuarioService
					.registrarUsuario(id, usuario)
					.then(async () => {
						const credentialsUser = await loginUser(email, senha);
						if (!credentialsUser.user) {
							mostrarMensagemErro("Não foi possível logar usuário.");
							return;
						}
						mostrarMensagemSucesso("Informações atualizadas.");
						clear();
						props.history.push("private/home");
					})
					.catch((error) => console.error(error));
			})
			.catch((error) => console.error(error));
	};

	const verificarEmail = async () => {
		if (!email || email.trim().length === 0) {
			mostrarMensagemErro("E-mail não preenchido.");
			return;
		}
		const user = await usuarioService.getUsuarioPorEmail(email!);
		if (!user) {
			mostrarMensagemErro("E-mail não encontrado.");
			return;
		}
		setUsuario(user);
		setFinalizarCadastro(true);
	};

	const voltar = () => {
		clear();
		props.history.goBack();
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton
							onClick={() => {
								voltar();
							}}
						>
							<IonIcon slot="icon-only" icon={chevronBack} />
						</IonButton>
					</IonButtons>
					<IonTitle />
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen scrollY={false}>
				<IonCard>
					<IonList lines="none">
						<IonItem className="item-config">
							<IonIcon className="icon-config" icon={mailOutline} />
							<IonInput
								disabled={showFinalizarCadastro}
								className="input-config"
								value={email}
								onIonChange={(e) => setEmail(e.detail.value!)}
								placeholder="E-mail"
								type="email"
							/>
						</IonItem>
						<div className={showFinalizarCadastro ? "" : "ion-hide"}>
							<IonItem className="item-config">
								<IonLabel>Finalize seu cadastro</IonLabel>
							</IonItem>
							<IonItem className="item-config">
								<IonIcon className="icon-config" icon={keyOutline} />
								<IonInput
									className="input-config"
									value={senha}
									onIonChange={(e) => setSenha(e.detail.value!)}
									placeholder="Senha"
									type="password"
								/>
							</IonItem>
						</div>
					</IonList>
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={() => {
							if (showFinalizarCadastro) {
								acessar();
							} else {
								verificarEmail();
							}
						}}
					>
						{showFinalizarCadastro ? "Acessar" : "Buscar"}
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
					message={mensagemSuccessBox}
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default PrimeiroAcesso;
