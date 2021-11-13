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
import EscolaService from "../../services/EscolaService";
import Escola from "../../models/Escola";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemEscolas: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();

	const [listaEscolas, setListaEscolas] = useState<Escola[]>();

	const filtrar = useCallback(
		(escola: Escola): boolean => {
			if (typeof filtroStatus !== "undefined" && escola.status !== filtroStatus) {
				return false;
			}
			return true;
		},
		[filtroStatus]
	);

	const buscar = useCallback(() => {
		if (!auth?.user?.id) return;
		const escolaService = new EscolaService();
		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			escolaService.listar().then((escolas) => {
				setListaEscolas(escolas.filter((item) => filtrar(item)));
			});
		} else {
			const promises: Promise<Escola | undefined>[] = [];
			auth.user.listaEscola.forEach((item) => {
				promises.push(escolaService.getById(item));
			});

			Promise.all(promises)
				.then((escolas) => {
					setListaEscolas(
						(
							escolas.filter((item) => typeof item !== "undefined") as Escola[]
						).filter((item) => filtrar(item))
					);
				})
				.catch((error) => {
					console.error(error);
					setListaEscolas([]);
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
					<IonTitle>Escolas</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setShowModalFiltro(true)}>
							<IonIcon slot="icon-only" icon={optionsOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaEscolas && <LoadingSpinner />}
				{listaEscolas && listaEscolas.length === 0 && (
					<IonList>
						<IonItem>
							<IonLabel>Nenhuma escola encontrada</IonLabel>
						</IonItem>
					</IonList>
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

export default ListagemEscolas;
