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
import UsuarioService from "../../services/UsuarioService";
import TurmaService from "../../services/TurmaService";
import AlunoService from "../../services/AlunoService";
import Aluno from "../../models/Aluno";
import { TipoUsuario } from "../../models/Usuario";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListagemAlunos: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [listaAlunos, setListaAlunos] = useState<Aluno[]>();

	useEffect(() => {
		if (!auth?.user?.id) return;

		if (auth.user.tipo === TipoUsuario.ADMINISTRADOR) {
			new AlunoService().listar().then((alunos) => {
				setListaAlunos(alunos);
			});
		} else {
			new UsuarioService().getById(auth.user.id).then((usuario) => {
				const listaEscolas = usuario!.listaEscola;
				if (listaEscolas) {
					new TurmaService().listarPorEscola(listaEscolas).then((turmas) => {
						new AlunoService()
							.listarPorTurma(turmas.map((item) => item.id!))
							.then((alunos) => {
								setListaAlunos(alunos);
							});
					});
				}
			});
		}
	}, [auth?.user?.id, auth.user.tipo]);

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
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{!listaAlunos && <LoadingSpinner />}
				{listaAlunos && listaAlunos.length === 0 && (
					<IonLabel>Nenhum aluno encontrado</IonLabel>
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
			</IonContent>
		</IonPage>
	);
};

export default ListagemAlunos;
