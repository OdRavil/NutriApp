/* eslint-disable no-undef */
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import { useAuth } from "../../context/auth";
import TurmaService from "../../services/TurmaService";
import Turma from "../../models/Turma";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemTurmas: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [listaTurmas, setListaTurmas] = useState<Turma[]>();

	useEffect(() => {
		if (!auth?.user?.id) return;
		const turmaService = new TurmaService();
		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			turmaService.listar().then((turmas) => {
				setListaTurmas(turmas);
			});
		} else {
			turmaService
				.listarPorEscola(auth.user.listaEscola)
				.then((turmas) => {
					setListaTurmas(turmas);
				})
				.catch((error) => {
					console.error(error);
					setListaTurmas([]);
				});
		}
	}, [auth?.user?.id, auth?.user?.tipo, auth?.user?.listaEscola]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Turmas</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaTurmas && <LoadingSpinner />}
				{listaTurmas && listaTurmas.length === 0 && (
					<IonLabel>Nenhuma turma encontrada</IonLabel>
				)}
				{listaTurmas && listaTurmas.length !== 0 && (
					<IonList>
						{listaTurmas.map((turma) => (
							<IonItem key={turma.id!} routerLink={`/turma/visualizar/${turma.id!}`}>
								<IonLabel>{turma.codigo}</IonLabel>
							</IonItem>
						))}
					</IonList>
				)}
			</IonContent>
		</IonPage>
	);
};

export default ListagemTurmas;
