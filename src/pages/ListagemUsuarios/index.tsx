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
import { arrowBackOutline, closeOutline, optionsOutline } from "ionicons/icons";
import { useAuth } from "../../context/auth";
import UsuarioService from "../../services/UsuarioService";
import Usuario from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemUsuarios: React.FC = () => {
	const router = useIonRouter();

	const navigateBack = () => router.canGoBack() && router.goBack();

	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();
	const [filtroEscola, setFiltroEscola] = useState<string>();

	const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>();

	const filtrar = useCallback(
		(usuario: Usuario): boolean => {
			if (typeof filtroStatus !== "undefined" && usuario.status !== filtroStatus) {
				return false;
			}

			return true;
		},
		[filtroStatus, filtroEscola]
	);

	const buscar = useCallback(() => {
		if (!auth?.user?.id) return;
		new UsuarioService().listar().then(async (usuarios) => {
			setListaUsuarios(await usuarios.filter((item) => filtrar(item)));
		});
	}, [auth?.user?.id, auth.user.tipo, filtrar]);

	const aplicarFiltros = () => {
		buscar();
		setShowModalFiltro(false);
	};

	const limparFiltros = () => {
		setFiltroStatus(undefined);
		setFiltroEscola(undefined);
		setFiltroEscola(undefined);
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
						<IonButton onClick={() => navigateBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Usuarios</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setShowModalFiltro(true)}>
							<IonIcon slot="icon-only" icon={optionsOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaUsuarios && <LoadingSpinner />}
				{listaUsuarios && listaUsuarios.length === 0 && (
					<IonList>
						<IonItem>
							<IonLabel>Nenhum usuario encontrado</IonLabel>
						</IonItem>
					</IonList>
				)}
				{listaUsuarios && listaUsuarios.length !== 0 && (
					<IonList>
						{listaUsuarios.map((usuario) => (
							<IonItem
								key={usuario.id!}
								routerLink={`/usuario/visualizar/${usuario.id!}`}
							>
								<IonLabel>{usuario.nome}</IonLabel>
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

export default ListagemUsuarios;
