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
import UsuarioService from "../../services/UsuarioService";
import TurmaService from "../../services/TurmaService";
import AlunoService from "../../services/AlunoService";
import Aluno from "../../models/Aluno";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemAlunos: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();

	const [listaAlunos, setListaAlunos] = useState<Aluno[]>();

	const filtrar = useCallback(
		(aluno: Aluno): boolean => {
			if (typeof filtroStatus !== "undefined" && aluno.status !== filtroStatus) {
				return false;
			}
			return true;
		},
		[filtroStatus]
	);

	const buscar = useCallback(() => {
		if (!auth?.user?.id) return;

		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			new AlunoService().listar().then((alunos) => {
				setListaAlunos(alunos.filter((item) => filtrar(item)));
			});
		} else {
			new UsuarioService().getById(auth.user.id).then((usuario) => {
				const listaEscolas = usuario!.listaEscola;
				if (listaEscolas) {
					new TurmaService().listarPorEscola(listaEscolas).then((turmas) => {
						new AlunoService()
							.listarPorTurma(turmas.map((item) => item.id!))
							.then((alunos) => {
								setListaAlunos(alunos.filter((item) => filtrar(item)));
							});
					});
				}
			});
		}
	}, [auth?.user?.id, auth.user.tipo, filtrar]);

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
					<IonTitle>Alunos</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setShowModalFiltro(true)}>
							<IonIcon slot="icon-only" icon={optionsOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaAlunos && <LoadingSpinner />}
				{listaAlunos && listaAlunos.length === 0 && (
					<IonList>
						<IonItem>
							<IonLabel>Nenhum aluno encontrado</IonLabel>
						</IonItem>
					</IonList>
				)}
				{listaAlunos && listaAlunos.length !== 0 && (
					<IonList>
						{listaAlunos.map((aluno) => (
							<IonItem key={aluno.id!} routerLink={`/aluno/visualizar/${aluno.id!}`}>
								<IonLabel>{aluno.nome}</IonLabel>
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

export default ListagemAlunos;
