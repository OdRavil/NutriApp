import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonInput,
	IonItem,
	IonLabel,
	IonLoading,
	IonPage,
	IonRouterLink,
	IonRow,
	IonToast,
	useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";

// Import Context
import { useAuth } from "../../context/auth";

const Login: React.FC = () => {
	const router = useIonRouter();

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
		router.push("/private/home");

		await login(email, password)
			.then((authUser) => {
				if (!authUser.user) {
					mostrarMensagemErro("Não foi possível logar usuário.");
					return;
				}
				setTimeout(() => {
					setShowLoading(false);
					setEmail("");
					setPassword("");
					router.push("/private/home");
				}, 1000);
			})
			.catch((error) => {
				console.error(error);
				mostrarMensagemErro(error.message);
				setShowLoading(false);
			});
	};

	return (
		<IonPage>
			<IonContent
				fullscreen
				className="ion-padding ion-text-center"
				scrollY={false}
			>
				<IonLoading
					isOpen={showLoading}
					onDidDismiss={() => setShowLoading(false)}
				/>
				<IonToast
					isOpen={showErrorBox}
					onDidDismiss={() => setShowErrorBox(false)}
					message={mensagemErrorBox}
					duration={1000}
					position="top"
					color="danger"
				/>
				<IonGrid>
					<IonRow>
						<IonCol>
							<img
								style={{ maxHeight: "70em" }}
								alt=""
								src="./assets/logo_healthteens-01.png"
							/>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem className="inputField">
								<IonLabel position="floating">E-mail</IonLabel>
								<IonInput
									placeholder="E-mail"
									type="email"
									autocorrect="off"
									value={email}
									onIonChange={(e: any) => setEmail(e.target.value)}
								/>
							</IonItem>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem className="inputField">
								<IonLabel position="floating">Senha</IonLabel>
								<IonInput
									placeholder="Senha"
									type="password"
									value={password}
									onIonChange={(e: any) => setPassword(e.target.value)}
								/>
							</IonItem>
						</IonCol>
					</IonRow>
				</IonGrid>

				<IonRow>
					<IonCol>
						<IonButton expand="block" onClick={doLogin}>
							Acessar
						</IonButton>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol>
						<IonButton expand="block" routerLink="/login/primeiro-acesso">
							Primeiro acesso?
						</IonButton>
					</IonCol>
				</IonRow>
				<IonRow className="ion-text-right">
					<IonCol>
						<IonRouterLink routerLink="/login/esqueci-senha">
							Esqueceu sua senha?
						</IonRouterLink>
					</IonCol>
				</IonRow>
			</IonContent>
		</IonPage>
	);
};

export default Login;
