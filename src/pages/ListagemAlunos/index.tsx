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
import Escola from "../../models/Escola";
import EscolaService from "../../services/EscolaService";
import Turma from "../../models/Turma";

const ListagemAlunos: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [showModalFiltro, setShowModalFiltro] = useState<boolean>(false);
	const [filtroStatus, setFiltroStatus] = useState<boolean>();
	const [filtroEscola, setFiltroEscola] = useState<string>();
	const [filtroTurma, setFiltroTurma] = useState<string>();

	const [listaAlunos, setListaAlunos] = useState<Aluno[]>();
	const [listaEscolas, setListaEscolas] = useState<Escola[]>([]);
	const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);

	const filtrar = useCallback(
		(aluno: Aluno): boolean => {
			if (typeof filtroStatus !== "undefined" && aluno.status !== filtroStatus) {
				return false;
			}
			if (typeof filtroTurma !== "undefined" && aluno.idTurma !== filtroTurma) {
				return false;
			}
			return true;
		},
		[filtroStatus, filtroTurma]
	);

	const filtrarPorEscola = useCallback(
		async (alunos: Aluno[]): Promise<Aluno[]> => {
			if (typeof filtroEscola === "undefined") return alunos;

			const turmas = await (
				await new TurmaService().listarPorEscola([filtroEscola])
			).map((item) => item.id!);
			return alunos.filter((aluno) => turmas.includes(aluno.idTurma));
		},
		[filtroEscola]
	);

	const buscar = useCallback(() => {
		if (!auth?.user?.id) return;
		console.log("dasdasasddsa");
		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			new AlunoService().listar().then(async (alunos) => {
				setListaAlunos(
					await filtrarPorEscola(alunos.filter((item) => filtrar(item)))
				);
			});
		} else {
			new UsuarioService().getById(auth.user.id).then((usuario) => {
				const lista = usuario!.listaEscola;
				if (lista) {
					new TurmaService().listarPorEscola(lista).then((turmas) => {
						new AlunoService()
							.listarPorTurma(turmas.map((item) => item.id!))
							.then(async (alunos) => {
								setListaAlunos(
									await filtrarPorEscola(alunos.filter((item) => filtrar(item)))
								);
							});
					});
				}
			});
		}
	}, [auth?.user?.id, auth.user.tipo, filtrar, filtrarPorEscola]);

	const aplicarFiltros = () => {
		buscar();
		setShowModalFiltro(false);
	};

	const limparFiltros = () => {
		setFiltroStatus(undefined);
		setFiltroEscola(undefined);
		setFiltroTurma(undefined);
		aplicarFiltros();
	};

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
	}, [auth?.user?.id, auth.user.listaEscola, auth.user.tipo]);

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
									<IonItem className="item-config" lines="none">
										<IonLabel>Turma</IonLabel>
										<IonSelect
											className="input-config"
											value={filtroTurma}
											placeholder="Turma"
											onIonChange={(e) => setFiltroTurma(e.detail.value)}
										>
											{listaTurmas.length === 0 && <IonSelectOption value="" />}
											{listaTurmas.length !== 0 &&
												listaTurmas.map((item) => (
													<IonSelectOption key={item.id!} value={item.id!}>
														{item.codigo}
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

export default ListagemAlunos;
