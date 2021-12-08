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
	useIonRouter,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import "firebase/auth";

// Import Icons
import {
	arrowBackOutline,
	arrowForward,
	closeOutline,
	optionsOutline,
	people,
} from "ionicons/icons";

// Import Context
import { useAuth } from "../../context/auth";

// Import Services
import TurmaService from "../../services/TurmaService";
import EscolaService from "../../services/EscolaService";

// Import Models
import Turma from "../../models/Turma";
import { TipoUsuario } from "../../models/Usuario";
import Escola from "../../models/Escola";

// Import Components
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemTurmas: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();
	const [filtroEscola, setFiltroEscola] = useState<string>();

	const [listaTurmas, setListaTurmas] = useState<Turma[]>();
	const [listaEscolas, setListaEscolas] = useState<Escola[]>([]);

	const filtrar = useCallback(
		(turma: Turma): boolean => {
			if (typeof filtroStatus !== "undefined" && turma.status !== filtroStatus) {
				return false;
			}
			if (typeof filtroEscola !== "undefined" && turma.idEscola !== filtroEscola) {
				return false;
			}
			return true;
		},
		[filtroStatus, filtroEscola]
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
		setFiltroEscola(undefined);
		aplicarFiltros();
	};

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

	useEffect(() => {
		buscar();
	}, [buscar]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => navigateBack()}>
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
								<IonIcon src={people} />
								<IonLabel className="m-l-10">{turma.codigo}</IonLabel>
								<IonIcon src={arrowForward} />
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
									<IonItem className="item-config" lines="none">
										<IonLabel>Escola</IonLabel>
										<IonSelect
											className="input-config"
											value={filtroEscola}
											placeholder="Escola"
											onIonChange={(e) => setFiltroEscola(e.detail.value)}
										>
											{listaEscolas.length === 0 && <IonSelectOption value="" />}
											{listaEscolas.length !== 0 &&
												listaEscolas.map((item) => (
													<IonSelectOption key={item.id!} value={item.id!}>
														{item.nome}
													</IonSelectOption>
												))}
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
