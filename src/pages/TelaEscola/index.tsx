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
	IonLabel,
	IonList,
	IonPage,
	IonTextarea,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import EscolaService from "../../services/EscolaService";
import Escola from "../../models/Escola";
import LoadingSpinner from "../../components/LoadingSpinner";

interface TelaEscolaProps {
	idEscola: string;
}

const TelaEscola: React.FC<RouteComponentProps<TelaEscolaProps>> = (props) => {
	const { idEscola } = props.match.params;
	const [escola, setEscola] = useState<Escola>();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [descricao, setDescricao] = useState<string>("");

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const salvar = async () => {
		if (!escola) return;
		if (!nome || nome.trim().length === 0) {
			mostrarMensagemErro("Nome não preenchido.");
			return;
		}
		if (!descricao || descricao.trim().length === 0) {
			mostrarMensagemErro("Descrição não preenchida.");
			return;
		}

		try {
			escola.nome = nome;
			escola.descricao = descricao;
			await new EscolaService().updateData(escola.id!, escola);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	useEffect(() => {
		if (!idEscola) return;
		new EscolaService()
			.getById(idEscola)
			.then((myEscola) => {
				setEscola(myEscola);
			})
			.catch((error) => {
				console.error(error);
				mostrarMensagemErro("Ocorreu um erro ao carregar escola.");
			});
	}, [idEscola]);

	useEffect(() => {
		setNome(escola?.nome || "");
		setDescricao(escola?.descricao || "");
	}, [escola]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Escola</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="ion-padding">
				<IonCard>
					{!escola && <LoadingSpinner />}
					{escola && (
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
									Descrição
								</IonLabel>
								<IonTextarea
									className="input-config"
									value={descricao}
									placeholder="Descrição"
									onIonChange={(e) => setDescricao(e.detail.value!)}
								/>
							</IonItem>
						</IonList>
					)}
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={salvar}
						className="register-button"
						disabled={!escola}
					>
						Salvar
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
					message="Alterado com Sucesso."
					duration={700}
					color="success"
				/>
			</IonContent>
		</IonPage>
	);
};

export default TelaEscola;
