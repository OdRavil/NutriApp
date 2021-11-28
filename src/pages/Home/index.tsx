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
	useIonAlert,
	IonToast,
} from "@ionic/react";
import React, { useCallback, useState } from "react";
import moment from "moment";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useAuth } from "../../context/auth";
import { TipoUsuario } from "../../models/Usuario";
import "./index.css";
import useExcelAlunos from "../../hooks/ExcelAlunos";

const Home: React.FC = () => {
	const { auth } = useAuth();

	const [exportarDadosAlunos] = useExcelAlunos();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);

	const [alertaExportarAnamnese] = useIonAlert();

	const mostrarMensagemErro = (erro: Error) => {
		setMensagemErrorBox(erro.message);
		setShowErrorBox(true);
	};

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

	const exportarAnamnese = async () => {
		try {
			const workbook = await exportarDadosAlunos();
			if (!workbook) return;
			const buffer = await workbook.xlsx.writeBuffer();
			await Filesystem.writeFile({
				path: `export-alunos-${moment().format("DDMMYYY_Hmmss")}.xlsx`,
				data: Buffer.from(buffer).toString("base64"),
				directory: Directory.Documents,
			});
			setShowSuccessBox(true);
		} catch (error: any) {
			mostrarMensagemErro(error.message);
		}
	};

	const handleExportarAnamnese = () => {
		alertaExportarAnamnese({
			message: "Exportar os dados dos alunos?",
			buttons: [
				"Não",
				{
					text: "Sim",
					handler: () => exportarAnamnese(),
				},
			],
		});
	};

	const getHomeAdministrador = () => (
		<IonList>
			<IonItemDivider>
				<IonLabel>Anamnese</IonLabel>
			</IonItemDivider>
			<IonItem routerLink="/anamnese">
				<IonLabel>Fazer a Anamnese</IonLabel>
			</IonItem>
			<IonItem lines="none" onClick={() => handleExportarAnamnese()}>
				<IonLabel>Exportar</IonLabel>
			</IonItem>
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
			<IonItem lines="none" onClick={() => handleExportarAnamnese()}>
				<IonLabel>Exportar</IonLabel>
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
			<IonItem lines="none" routerLink="/anamnese">
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
			<IonToast
				isOpen={showErrorBox}
				onDidDismiss={() => setShowErrorBox(false)}
				message={mensagemErrorBox}
				duration={1000}
				position="top"
				color="danger"
			/>
			<IonToast
				isOpen={showSuccessBox}
				onDidDismiss={() => setShowSuccessBox(false)}
				message="Arquivo salvo no dispositivo com sucesso."
				duration={1500}
				position="top"
				color="success"
			/>
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
