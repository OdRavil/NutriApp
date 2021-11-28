import {
	IonButton,
	IonCard,
	IonContent,
	IonHeader,
	IonInput,
	IonItem,
	IonPage,
	IonTitle,
	IonToolbar,
	IonToast,
	IonList,
	IonIcon,
	IonSelect,
	IonSelectOption,
	IonDatetime,
	IonButtons,
	IonGrid,
	IonRow,
	IonCol,
	useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import {
	calendarOutline,
	chevronBack,
	mailOutline,
	maleFemaleOutline,
	peopleOutline,
	personOutline,
} from "ionicons/icons";
import firebase from "firebase/app";
import Usuario, { Sexo, TipoUsuario } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import "firebase/firestore";

const CadastroUsuario: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [tipo, setTipo] = useState<TipoUsuario>(TipoUsuario.PROFESSOR);
	const [dataNascimento, setDataNascimento] = useState<string>();
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const cadastrar = async () => {
		if (!nome || nome.trim().length === 0) {
			mostrarMensagemErro("Nome não preenchido.");
			return;
		}
		if (!email || email.trim().length === 0) {
			mostrarMensagemErro("E-mail não preenchido.");
			return;
		}
		if (!tipo || tipo.trim().length === 0) {
			mostrarMensagemErro("Tipo não preenchido.");
			return;
		}
		if (!sexo || sexo.trim().length === 0) {
			mostrarMensagemErro("Sexo não preenchido.");
			return;
		}

		try {
			const usuario: Usuario = {
				nome: nome.trim(),
				email: email.trim(),
				tipo,
				sexo,
				dataNascimento: dataNascimento
					? firebase.firestore.Timestamp.fromDate(new Date(dataNascimento))
					: undefined,
			};
			usuario.id = await new UsuarioService().pushData(usuario);
			setNome("");
			setEmail("");
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonIcon icon={chevronBack} size="large" onClick={() => navigateBack()} />
					</IonButtons>
					<IonTitle>Cadastro de Usuario</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding" fullscreen scrollY={false}>
				<IonCard>
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
							<IonIcon className="icon-config" icon={peopleOutline} />
							<IonSelect
								className="input-config"
								value={tipo}
								placeholder="Tipo"
								onIonChange={(e) => setTipo(e.detail.value)}
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
				</IonCard>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								color="primary"
								expand="block"
								onClick={cadastrar}
								className="register-button"
							>
								Cadastrar
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
					message="Cadastrado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default CadastroUsuario;
