/* eslint-disable no-undef */
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonModal,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline, closeOutline, optionsOutline } from "ionicons/icons";
import { useAuth } from "../../context/auth";
import TurmaService from "../../services/TurmaService";
import Turma from "../../models/Turma";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemTurmas: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();

	const [listaTurmas, setListaTurmas] = useState<Turma[]>();

	const filtrar = useCallback(
		(turma: Turma): boolean => {
			if (typeof filtroStatus !== "undefined" && turma.status !== filtroStatus) {
				return false;
			}
			return true;
		},
		[filtroStatus]
	);

	const buscar = useCallback(() => {
		if (!auth?.user?.id) return;
		const turmaService = new TurmaService();
		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			turmaService.listar().then((turmas) => {
				setListaTurmas(turmas.filter((item) => filtrar(item)));
			});
		} else {
			turmaService
				.listarPorEscola(auth.user.listaEscola)
				.then((turmas) => {
					setListaTurmas(turmas.filter((item) => filtrar(item)));
				})
				.catch((error) => {
					console.error(error);
					setListaTurmas([]);
				});
		}
	}, [auth?.user?.id, auth?.user?.tipo, auth?.user?.listaEscola, filtrar]);

	const aplicarFiltros = () => {
		buscar();
		setShowModalFiltro(false);
	};

	const limparFiltros = () => {
		setFiltroStatus(undefined);
		aplicarFiltros();
	};

	useEffect(() => {
		buscar();
	}, [buscar]);

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
					<IonButtons slot="end">
						<IonButton onClick={() => setShowModalFiltro(true)}>
							<IonIcon slot="icon-only" icon={optionsOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaTurmas && <LoadingSpinner />}
				{listaTurmas && listaTurmas.length === 0 && (
					<IonList>
						<IonItem>
							<IonLabel>Nenhuma turma encontrada</IonLabel>
						</IonItem>
					</IonList>
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
				<IonModal isOpen={showModalFiltro} cssClass="filter-modal">
					<IonHeader class="ion-no-border">
						<IonToolbar>
							<IonTitle>Filtro</IonTitle>
							<IonButtons slot="end">
								<IonButton onClick={() => setShowModalFiltro(false)}>
									<IonIcon slot="icon-only" icon={closeOutline} />
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonContent>
						<IonCard>
							<IonCardContent>
								<IonList>
									<IonItem className="item-config" lines="none">
										<IonLabel>Status</IonLabel>
										<IonSelect
											className="input-config"
											value={filtroStatus}
											placeholder="Status"
											onIonChange={(e) => setFiltroStatus(e.detail.value)}
										>
											<IonSelectOption value>Ativo</IonSelectOption>
											<IonSelectOption value={false}>Inativo</IonSelectOption>
										</IonSelect>
									</IonItem>
								</IonList>
							</IonCardContent>
						</IonCard>
						<IonButton
							className="ion-margin"
							expand="block"
							onClick={() => aplicarFiltros()}
						>
							Aplicar filtros
							<IonIcon icon={optionsOutline} slot="start" />
						</IonButton>
						<IonButton
							className="ion-margin"
							expand="block"
							onClick={() => limparFiltros()}
						>
							Limpar
						</IonButton>
					</IonContent>
				</IonModal>
			</IonContent>
		</IonPage>
	);
};

export default ListagemTurmas;
