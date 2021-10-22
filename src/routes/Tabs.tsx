import React from "react";
import {
	IonTabs,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonIcon,
	IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router";
import { home, person, settings } from "ionicons/icons";

import Home from "../pages/Home";
import Configuracao from "../pages/Configuracao";
import CadastroUsuario from "../pages/CadastroUsuario";
import CadastroEscola from "../pages/CadastroEscola";
import CadastroTurma from "../pages/CadastroTurma";
import CadastroAluno from "../pages/CadastroAluno";

const Tabs: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Redirect exact path="/private" to="/private/home" />
			<Route exact path="/private/home" component={Home} />
			<Route exact path="/private/configuracao" component={Configuracao} />
			<Route exact path="/private/cadastro-usuario" component={CadastroUsuario} />
			<Route exact path="/private/cadastro-escola" component={CadastroEscola} />
			<Route exact path="/private/cadastro-turma" component={CadastroTurma} />
			<Route exact path="/private/cadastro-aluno" component={CadastroAluno} />
		</IonRouterOutlet>
		<IonTabBar slot="bottom">
			<IonTabButton tab="home" href="/private/home">
				<IonIcon icon={home} />
				<IonLabel>Home</IonLabel>
			</IonTabButton>
			<IonTabButton tab="configuracao" href="/private/configuracao">
				<IonIcon icon={settings} />
				<IonLabel>Configurações</IonLabel>
			</IonTabButton>
			<IonTabButton tab="cadastro-usuario" href="/private/cadastro-usuario">
				<IonIcon icon={person} />
				<IonLabel>Cadastro de Usuário</IonLabel>
			</IonTabButton>
			<IonTabButton tab="cadastro-escola" href="/private/cadastro-escola">
				<IonIcon icon={person} />
				<IonLabel>Cadastro de Escola</IonLabel>
			</IonTabButton>
			<IonTabButton tab="cadastro-turma" href="/private/cadastro-turma">
				<IonIcon icon={person} />
				<IonLabel>Cadastro de Turma</IonLabel>
			</IonTabButton>
			<IonTabButton tab="cadastro-aluno" href="/private/cadastro-aluno">
				<IonIcon icon={person} />
				<IonLabel>Cadastro de Aluno</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
);

export default Tabs;
