/* eslint-disable no-undef */
import {
	IonButton,
	IonButtons,
	IonCard,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import TurmaService from "../../services/TurmaService";
import AlunoService from "../../services/AlunoService";
import Aluno from "../../models/Aluno";
import Turma from "../../models/Turma";

interface TelaAlunoProps {
	idAluno: string;
}

const TelaAluno: React.FC<RouteComponentProps<TelaAlunoProps>> = (props) => {
	const { idAluno } = props.match.params;
	const [aluno, setAluno] = useState<Aluno>();
	const [turma, setTurma] = useState<Turma>();

	useEffect(() => {
		if (idAluno) {
			new AlunoService().getById(idAluno).then((myAluno) => {
				setAluno(myAluno);

				if (myAluno?.idTurma) {
					new TurmaService().getById(myAluno?.idTurma).then((myTurma) => {
						setTurma(myTurma);
					});
				}
			});
		}
	}, [setAluno, setTurma]);

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
				<IonCard>
					<IonLabel>Nome: {aluno?.nome}</IonLabel>
					<IonLabel>E-mail: {aluno?.email}</IonLabel>
					<IonLabel>Sexo: {aluno?.sexo}</IonLabel>
					<IonLabel>Data de Nascimento: {aluno?.dataNascimento}</IonLabel>
					<IonLabel>Codigo da Turma: {turma?.codigo}</IonLabel>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default TelaAluno;
