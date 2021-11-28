import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonLoading,
	IonPage,
	IonRouterLink,
	IonRow,
	IonTitle,
	IonToast,
	IonToolbar,
	useIonRouter,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";

const Login: React.FC = () => {
	const router = useIonRouter();

	const { signed, login } = useAuth();

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
				router.push("/private/home", "none", "replace");
			})
			.catch((error) => {
				console.error(error);
				mostrarMensagemErro(error.message);
				setShowLoading(false);
			});
	};

	useEffect(() => {
		if (signed) router.push("/private/home", "none", "replace");
	}, [signed]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader>
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
							<IonIcon
								style={{ fontSize: "70px", color: "#0040ff" }}
								icon={personCircle}
							/>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position="floating">E-mail</IonLabel>
								<IonInput
									placeholder="E-mail"
									type="email"
									autocorrect="off"
									onIonChange={(e: any) => setEmail(e.target.value)}
								/>
							</IonItem>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position="floating">Senha</IonLabel>
								<IonInput
									placeholder="Senha"
									type="password"
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
						<IonButton expand="block" routerLink="/primeiro-acesso">
							Primeiro acesso?
						</IonButton>
					</IonCol>
				</IonRow>
				<IonRow className="ion-text-right">
					<IonCol>
						<IonRouterLink routerLink="/esqueci-senha">
							Esqueceu sua senha?
						</IonRouterLink>
					</IonCol>
				</IonRow>
			</IonContent>
		</IonPage>
	);
};

export default Login;
