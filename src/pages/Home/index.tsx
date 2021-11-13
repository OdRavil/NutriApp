import {
	IonList,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonLabel,
	IonItem,
	IonItemDivider,
} from "@ionic/react";
import React from "react";
import "./index.css";

const Home: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Home</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent fullscreen>
			<IonList>
				<IonItemDivider>
					<IonLabel>Home</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/anamnese">
					<IonLabel>Anamnese</IonLabel>
				</IonItem>
				<IonItemDivider>
					<IonLabel>Usuário</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/usuario/cadastrar">
					<IonLabel>Cadastro de Usuário</IonLabel>
				</IonItem>
				<IonItemDivider>
					<IonLabel>Escola</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/escola/cadastrar">
					<IonLabel>Cadastro de Escola</IonLabel>
				</IonItem>
				<IonItem routerLink="/escola/listar">
					<IonLabel>Listagem</IonLabel>
				</IonItem>
				<IonItemDivider>
					<IonLabel>Turma</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/turma/cadastrar">
					<IonLabel>Cadastro de Turma</IonLabel>
				</IonItem>
				<IonItemDivider>
					<IonLabel>Aluno</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/aluno/cadastrar">
					<IonLabel>Cadastro Aluno</IonLabel>
				</IonItem>
				<IonItem routerLink="/aluno/listar">
					<IonLabel>Listagem</IonLabel>
				</IonItem>
			</IonList>
		</IonContent>
	</IonPage>
);

export default Home;
