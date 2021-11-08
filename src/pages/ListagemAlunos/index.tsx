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
import React, { useState } from "react";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import { useAuth } from "../../context/auth";
import UsuarioService from "../../services/UsuarioService";
import TurmaService from "../../services/TurmaService";
import AlunoService from "../../services/AlunoService";
import Aluno from "../../models/Aluno";

const ListagemAlunos: React.FC<RouteComponentProps> = (props) => {
	const user = useAuth();
	// const typeUser = user.auth.user.tipo;
	const userID = user.auth.user.id;

	const [listaAlunos, setListaAlunos] = useState<Aluno[]>([]);

	new UsuarioService().getById(userID).then((usuario) => {
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

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.history.goBack()}>
							<IonIcon slot="icon-only" icon={arrowBackOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Alterar senha</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="ion-padding">
				<IonList>
					{listaAlunos.map((aluno) => (
						<IonItem routerLink={`TelaAluno/${aluno.id}`}>
							<IonLabel>{aluno.nome}</IonLabel>
							<IonLabel>{aluno.email}</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default ListagemAlunos;
