import {
	IonButton,
	IonContent,
	IonHeader,
	IonInput,
	IonLoading,
	IonPage,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/auth";
import "./index.css";

const Login: React.FC<RouteComponentProps> = (props) => {
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

	const [showLoading, setShowLoading] = useState<boolean>(false);

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const doLogin = async () => {
		setShowLoading(true);
		await login(email, password)
			.then((authUser) => {
				if (!authUser.user) {
					mostrarMensagemErro("Não foi possível logar usuário.");
					return;
				}
				props.history.replace("private/home");
			})
			.catch((error) => {
				console.error(error);
				mostrarMensagemErro(error);
				setShowLoading(false);
			});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonLoading
					isOpen={showLoading}
					onDidDismiss={() => setShowLoading(false)}
				/>
				<IonToast
					isOpen={showErrorBox}
					onDidDismiss={() => setShowErrorBox(false)}
					message={mensagemErrorBox}
					duration={1000}
					position="bottom"
					color="danger"
				/>
				<IonInput
					placeholder="E-mail"
					type="email"
					onIonChange={(e: any) => setEmail(e.target.value)}
				/>
				<IonInput
					placeholder="Password"
					type="password"
					onIonChange={(e: any) => setPassword(e.target.value)}
				/>
				<IonButton onClick={doLogin}>Login</IonButton>
				<IonButton routerLink="/primeiro-acesso">Primeiro acesso?</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Login;
