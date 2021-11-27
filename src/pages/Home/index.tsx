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
import React, { useCallback } from "react";
import { useAuth } from "../../context/auth";
import { TipoUsuario } from "../../models/Usuario";
import "./index.css";

const Home: React.FC = () => {
	const { auth } = useAuth();

	const getPrimeiroNome = useCallback(() => {
		if (!auth?.user) return "";
		const [name] = auth?.user.nome.split(" ");
		return name.trim() || "";
	}, [auth?.user]);

	const getBoasVindas = () => {
		const name = getPrimeiroNome();
		if (name.length === 0) return "Olá!";
		return `Olá, ${name}!`;
	};

	const getHomeAdministrador = () => (
		<IonList>
			<IonItemDivider>
				<IonLabel>Anamnese</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/anamnese">
				<IonLabel>Fazer a Anamnese</IonLabel>
			</IonItem>
			{/* <IonItem lines="none" routerLink="/turma/listar">
				<IonLabel>Exportar</IonLabel>
			</IonItem> */}
			<IonItemDivider>
				<IonLabel>Usuário</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/usuario/cadastrar">
				<IonLabel>Cadastro de Usuário</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/usuario/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Escola</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/escola/cadastrar">
				<IonLabel>Cadastro de Escola</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/escola/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Turma</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/turma/cadastrar">
				<IonLabel>Cadastro de Turma</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/turma/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Aluno</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/aluno/cadastrar">
				<IonLabel>Cadastro Aluno</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/aluno/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
		</IonList>
	);

	const getHomeNutricionista = () => (
		<IonList>
			<IonItemDivider>
				<IonLabel>Anamnese</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/anamnese">
				<IonLabel>Fazer a Anamnese</IonLabel>
			</IonItem>
			{/* <IonItem lines="none" routerLink="/turma/listar">
				<IonLabel>Exportar</IonLabel>
			</IonItem> */}
			<IonItemDivider>
				<IonLabel>Turma</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/turma/cadastrar">
				<IonLabel>Cadastro de Turma</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/turma/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Aluno</IonLabel>
			</IonItemDivider>
			<IonItem lines="none" routerLink="/aluno/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
		</IonList>
	);

	const getHomeProfessor = () => (
		<IonList>
			<IonItemDivider>
				<IonLabel>Anamnese</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/anamnese">
				<IonLabel>Fazer a Anamnese</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Turma</IonLabel>
			</IonItemDivider>
			<IonItem lines="none" routerLink="/turma/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
			<IonItemDivider>
				<IonLabel>Aluno</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/aluno/cadastrar">
				<IonLabel>Cadastro Aluno</IonLabel>
			</IonItem>
			<IonItem lines="none" routerLink="/aluno/listar">
				<IonLabel>Listagem</IonLabel>
			</IonItem>
		</IonList>
	);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonText className="q-w-e">
						<h2>{getBoasVindas()}</h2>
					</IonText>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{auth?.user?.tipo === TipoUsuario.ADMINISTRADOR
					? getHomeAdministrador()
					: null}
				{auth?.user?.tipo === TipoUsuario.NUTRICIONISTA
					? getHomeNutricionista()
					: null}
				{auth?.user?.tipo === TipoUsuario.PROFESSOR ? getHomeProfessor() : null}
			</IonContent>
		</IonPage>
	);
};

export default Home;
