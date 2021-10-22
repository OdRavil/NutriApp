/* eslint-disable no-undef */
import {
	IonButton,
	IonButtons,
	IonCard,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonList,
	IonPage,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";

const MudarSenha: React.FC<RouteComponentProps> = (props) => {
	const [mensagemToastErro, setMensagemToastErro] = useState<string>("");
	const [showToastErro, setShowToastErro] = useState<boolean>(false);
	const [showToastSucesso, setShowToastSucesso] = useState<boolean>(false);
	const [desabilitarBotao, setDesabilitarBotao] = useState<boolean>(true);
	const [senhaAtual, setSenhaAtual] = useState<string>("");
	const [novaSenha, setNovaSenha] = useState<string>("");
	const [novaSenhaConfirma, setNovaSenhaConfirma] = useState<string>("");

	const [corNovaSenha, setCorNovaSenha] = useState<string>("default");
	const [corNovaSenhaConfirma, setCorNovaSenhaConfirma] =
		useState<string>("default");

	const botaoAlterar = useRef<HTMLIonButtonElement>(null);

	const verificaNovasSenhas = (): void => {
		if (novaSenhaConfirma.length === 0) {
			setCorNovaSenha("default");
			setCorNovaSenhaConfirma("default");
			return;
		}
		setCorNovaSenha(novaSenha === novaSenhaConfirma ? "success" : "danger");
		setCorNovaSenhaConfirma(
			novaSenha === novaSenhaConfirma ? "success" : "danger"
		);
	};

	const handleChanges = (): boolean => {
		if (botaoAlterar.current) {
			if (
				senhaAtual.length === 0 ||
				novaSenha.length === 0 ||
				novaSenhaConfirma.length === 0 ||
				novaSenha !== novaSenhaConfirma
			) {
				setDesabilitarBotao(true);
			} else {
				setDesabilitarBotao(false);
			}
		}
		verificaNovasSenhas();
		return true;
	};

	useEffect(() => {
		handleChanges();
	}, [senhaAtual, novaSenha, novaSenhaConfirma, handleChanges]);

	const redefinir = () => {
		const user = firebase.auth().currentUser!;
		const cred = firebase.auth.EmailAuthProvider.credential(
			user.email!,
			senhaAtual
		);

		user
			.reauthenticateWithCredential(cred)
			.then(() => {
				const userLocal = firebase.auth().currentUser!;
				userLocal
					.updatePassword(novaSenha)
					.then(() => {
						setShowToastSucesso(true);
						setTimeout(() => {
							props.history.goBack();
						}, 500);
					})
					.catch((error) => {
						setMensagemToastErro(error.message);
						setShowToastErro(true);
					});
			})
			.catch((error) => {
				setMensagemToastErro(error.message);
				setShowToastErro(true);
			});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Alterar senha</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="ion-padding">
				<IonToast
					isOpen={showToastSucesso}
					onDidDismiss={() => setShowToastSucesso(false)}
					message="Senha atualizada!"
					duration={600}
				/>
				<IonToast
					isOpen={showToastErro}
					onDidDismiss={() => setShowToastErro(false)}
					message={mensagemToastErro}
					duration={600}
				/>
				<IonList>
					<IonItem className="item-config" lines="none">
						<IonInput
							className="input-config"
							value={senhaAtual}
							onIonChange={(e) => setSenhaAtual(e.detail.value!)}
							placeholder="Senha atual"
							type="password"
						/>
					</IonItem>
					<IonItem className="item-config" lines="none">
						<IonInput
							className="input-config"
							color={corNovaSenha}
							value={novaSenha}
							onIonChange={(e) => setNovaSenha(e.detail.value!)}
							placeholder="Nova senha"
							type="password"
						/>
					</IonItem>
					<IonItem className="item-config" lines="none">
						<IonInput
							color={corNovaSenhaConfirma}
							className="input-config"
							value={novaSenhaConfirma}
							onIonChange={(e) => setNovaSenhaConfirma(e.detail.value!)}
							placeholder="Confirmar nova senha"
							type="password"
						/>
					</IonItem>
				</IonList>
				<IonCard>
					<IonButton
						ref={botaoAlterar}
						color="primary"
						expand="block"
						onClick={() => redefinir()}
						disabled={desabilitarBotao}
					>
						Alterar
					</IonButton>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default MudarSenha;
