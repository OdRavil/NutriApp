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
import EscolaService from "../../services/EscolaService";
import Escola from "../../models/Escola";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemEscolas: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [listaEscolas, setListaEscolas] = useState<Escola[]>();

	useEffect(() => {
		if (!auth?.user?.id) return;
		const escolaService = new EscolaService();
		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			escolaService.listar().then((escolas) => {
				setListaEscolas(escolas);
			});
		} else {
			const promises: Promise<Escola | undefined>[] = [];
			auth.user.listaEscola.forEach((item) => {
				promises.push(escolaService.getById(item));
			});

			Promise.all(promises)
				.then((escolas) => {
					setListaEscolas(
						escolas.filter((item) => typeof item !== "undefined") as Escola[]
					);
				})
				.catch((error) => {
					console.error(error);
					setListaEscolas([]);
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
					<IonTitle>Escolas</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaEscolas && <LoadingSpinner />}
				{listaEscolas && listaEscolas.length === 0 && (
					<IonLabel>Nenhuma escola encontrada</IonLabel>
				)}
				{listaEscolas && listaEscolas.length !== 0 && (
					<IonList>
						{listaEscolas.map((escola) => (
							<IonItem
								key={escola.id!}
								routerLink={`/escola/visualizar/${escola.id!}`}
							>
								<IonLabel>{escola.nome}</IonLabel>
							</IonItem>
						))}
					</IonList>
				)}
			</IonContent>
		</IonPage>
	);
};

export default ListagemEscolas;
