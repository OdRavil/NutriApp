import {
	IonButton,
	IonCard,
	IonCol,
	IonContent,
	IonDatetime,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonList,
	IonLoading,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToast,
	IonToolbar,
	useIonRouter,
} from "@ionic/react";
import {
	calendarOutline,
	mailOutline,
	maleFemaleOutline,
	manOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./index.css";
import { Sexo } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { validarEmail } from "../../utils/string";
import { useAuth } from "../../context/auth";

const usuarioService = new UsuarioService();

const Configuracao: React.FC = () => {
	const router = useIonRouter();

	const { auth, logout, setAuthUser } = useAuth();

	const [mensagemToastErro, setMensagemToastErro] = useState<string>("");
	const [showToastErro, setShowToastErro] = useState<boolean>(false);
	const [showToastSucesso, setShowToastSucesso] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState<boolean>(true);

	const [emailInvalido, setEmailInvalido] = useState<boolean>(false);
	const [nomeInvalido, setNomeInvalido] = useState<boolean>(false);
	const [bloquearPagina, setBloquearPagina] = useState<boolean>(false);

	const [email, setEmail] = useState<string>("");
	const [sexo, setSexo] = useState<Sexo>(Sexo.MASCULINO);
	const [nome, setNome] = useState<string>("");
	const [dataNascimento, setDataNascimento] = useState<string>("");

	useEffect(() => {
		if (!auth?.user?.id) {
			setEmail("");
			setSexo(Sexo.MASCULINO);
			setNome("");
			setDataNascimento("");
			return;
		}
		setShowLoading(true);
		usuarioService.getById(auth.user.id).then((usuario) => {
			if (!usuario) return;
			setEmail(usuario.email);
			setSexo(usuario.sexo || Sexo.MASCULINO);
			setNome(usuario.nome);
			setDataNascimento(
				usuario.dataNascimento ? usuario.dataNascimento.toDate().toISOString() : ""
			);
			setShowLoading(false);
		});
	}, [auth?.user?.id]);

	const getDadosParaAtualizar = () => {
		const data: any = {};
		auth.user.email !== email && (data.email = email);
		data.sexo = sexo;
		data.nome = nome;
		data.dataNascimento = firebase.firestore.Timestamp.fromDate(
			new Date(dataNascimento)
		);
		return data;
	};

	const sair = async () => {
		setShowLoading(true);
		await logout()
			.then(() => router.push("/", "forward", "replace"))
			.catch((error) => {
				console.error(error);
				setMensagemToastErro(error.message);
				setShowToastErro(true);
				setShowLoading(false);
			});
	};

	const permitirSalvar = () => !nomeInvalido && !emailInvalido;

	const salvar = async () => {
		if (!auth?.user?.id) return;
		try {
			setBloquearPagina(true);
			setShowLoading(true);
			const data = getDadosParaAtualizar();
			if (data.email) {
				await firebase.auth().currentUser!.updateEmail(email);
			}
			await usuarioService.updateData(auth.user.id, data).catch(console.error);
			const newUser = (await usuarioService.getById(auth.user.id))!;
			setAuthUser({
				user: {
					id: newUser.id!,
					email: newUser.email,
					nome: newUser.email,
					tipo: newUser.tipo,
					listaEscola: newUser.listaEscola || [],
				},
			});
		} catch (error: any) {
			console.error(error);
			setMensagemToastErro(error.message);
			setShowToastErro(true);
		} finally {
			setShowLoading(false);
			setBloquearPagina(false);
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Configuração</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen scrollY={false}>
				<IonToast
					isOpen={showToastSucesso}
					onDidDismiss={() => setShowToastSucesso(false)}
					message="Configurações atualizadas!"
					duration={600}
				/>
				<IonToast
					isOpen={showToastErro}
					onDidDismiss={() => setShowToastErro(false)}
					message={mensagemToastErro}
					duration={600}
				/>
				<IonLoading
					isOpen={showLoading}
					onDidDismiss={() => setShowLoading(false)}
				/>
				<IonCard>
					<IonList>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={mailOutline} />
							<IonInput
								className="input-config"
								color={emailInvalido ? "danger" : "default"}
								value={email}
								onIonChange={(e) => {
									const value = e.detail.value!;
									setEmail(value);
									setEmailInvalido(!value || value.length === 0 || !validarEmail(value));
								}}
								placeholder="E-mail"
								type="email"
								disabled={bloquearPagina}
							/>
						</IonItem>
					</IonList>
				</IonCard>
				<IonCard>
					<IonList>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={maleFemaleOutline} />
							<IonSelect
								className="input-config"
								value={sexo}
								placeholder="Sexo"
								onIonChange={(e) => setSexo(e.detail.value)}
								disabled={bloquearPagina}
							>
								<IonSelectOption value={Sexo.FEMININO}>Feminino</IonSelectOption>
								<IonSelectOption value={Sexo.MASCULINO}>Masculino</IonSelectOption>
							</IonSelect>
						</IonItem>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={manOutline} />
							<IonInput
								className="input-config"
								color={nomeInvalido ? "danger" : "default"}
								value={nome}
								onIonChange={(e) => {
									const value = e.detail.value!;
									setNome(value);
									setNomeInvalido(!value || value.length === 0);
								}}
								placeholder="Nome"
								type="text"
								disabled={bloquearPagina}
							/>
						</IonItem>
						<IonItem className="item-config" lines="none">
							<IonIcon className="icon-config" icon={calendarOutline} />
							<IonDatetime
								value={dataNascimento}
								onIonChange={(e) => setDataNascimento(e.detail.value!)}
								displayFormat="DD/MM/YYYY"
								className="input-config"
								placeholder="Data de nascimento"
								disabled={bloquearPagina}
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
								routerLink="/mudar-senha"
								disabled={bloquearPagina}
							>
								Mudar senha
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonButton
								color="primary"
								expand="block"
								onClick={() => salvar()}
								disabled={bloquearPagina || !permitirSalvar()}
							>
								Salvar
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								color="danger"
								expand="block"
								onClick={() => {
									sair();
								}}
							>
								Sair
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Configuracao;
