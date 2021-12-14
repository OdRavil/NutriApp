import {
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
	IonTitle,
	IonToast,
	IonToolbar,
	useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";

// Import Icons
import { chevronBack, keyOutline, mailOutline } from "ionicons/icons";

// Import Styles
import "./index.css";

// Import Services
import UsuarioService from "../../services/UsuarioService";

// Import Models
import Usuario from "../../models/Usuario";

// Import Context
import { useAuth } from "../../context/auth";

const usuarioService = new UsuarioService();

const PrimeiroAcesso: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const { register } = useAuth();

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

		register(usuario, email, senha)
			.then((auth) => {
				if (!auth.user) {
					mostrarMensagemErro("Não foi possível logar usuário.");
					return;
				}
				mostrarMensagemSucesso("Informações atualizadas.");
				clear();
				setTimeout(() => {
					clear();
					router.push("/private/home");
				}, 1000);
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
		navigateBack();
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
			<IonContent className="ion-padding" fullscreen scrollY={false}>
				<IonCard>
					<IonList lines="none">
						<IonItem className="item-config inputField">
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
							<IonItem className="item-config inputField">
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
				<IonGrid>
					<IonRow>
						<IonCol>
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
					message={mensagemSuccessBox}
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default PrimeiroAcesso;
