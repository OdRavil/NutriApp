import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
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
import firebase from "firebase/app";
import React, { useState } from "react";

// Import Icons
import { chevronBack, mailOutline } from "ionicons/icons";

// Import Styles
import "./index.css";

// Import Services
import UsuarioService from "../../services/UsuarioService";

const usuarioService = new UsuarioService();

const EsqueciMinhaSenha: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [mensagemSuccessBox, setMensagemSuccessBox] = useState<string>("");
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");

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
	};

	const enviar = async () => {
		if (!email || email.trim().length === 0) {
			mostrarMensagemErro("E-mail não preenchido.");
			return;
		}
		const user = await usuarioService.getUsuarioPorEmail(email!);
		if (!user) {
			mostrarMensagemErro("E-mail não encontrado.");
			return;
		}
		firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				mostrarMensagemSucesso("Email enviado com sucesso.");
			});
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
					<IonCardHeader>
						<IonCardSubtitle>Alteração de senha</IonCardSubtitle>
						<IonLabel>
							Para solicitar a alteração de senha, preencha com seu e-mail cadastrado.
						</IonLabel>
					</IonCardHeader>
					<IonList lines="none">
						<IonItem className="item-config inputField">
							<IonIcon className="icon-config" icon={mailOutline} />
							<IonInput
								className="input-config"
								value={email}
								onIonChange={(e) => setEmail(e.detail.value!)}
								placeholder="E-mail"
								type="email"
							/>
						</IonItem>
					</IonList>
				</IonCard>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton color="primary" expand="block" onClick={() => enviar()}>
								Enviar e-mail
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

export default EsqueciMinhaSenha;
