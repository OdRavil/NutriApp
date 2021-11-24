import {
	IonList,
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonLabel,
	IonItem,
	IonItemDivider,
	IonText,
} from "@ionic/react";
import React from "react";
import "./index.css";

const Home: React.FC = () => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonText className="q-w-e">
					<h2>BEM VINDO(A)</h2>
				</IonText>
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
				<IonItem routerLink="/turma/listar">
					<IonLabel>Listagem</IonLabel>
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
				<IonItemDivider>
					<IonLabel>Postagens</IonLabel>
				</IonItemDivider>
				<IonItem routerLink="/aluno/listar">
					<IonLabel>Orientaçãoes dos Nutricionistas</IonLabel>
				</IonItem>
			</IonList>
		</IonContent>
	</IonPage>
);

export default Home;
