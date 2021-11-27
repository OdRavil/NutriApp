import React from "react";
import { IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import Tabs from "./Tabs";
import Login from "../pages/Login";
import MudarSenha from "../pages/Configuracao/MudarSenha";
import PrimeiroAcesso from "../pages/PrimeiroAcesso";
import PrivateRoute from "./PrivateRoute";
import ListagemAlunos from "../pages/ListagemAlunos";
import Anamnese from "../pages/Anamnese";
import CadastroAluno from "../pages/CadastroAluno";
import TelaAluno from "../pages/TelaAluno";
import CadastroUsuario from "../pages/CadastroUsuario";
import CadastroEscola from "../pages/CadastroEscola";
import CadastroTurma from "../pages/CadastroTurma";
import ListagemEscolas from "../pages/ListagemEscolas";
import TelaEscola from "../pages/TelaEscola";
import TelaTurma from "../pages/TelaTurma";
import ListagemTurmas from "../pages/ListagemTurmas";
import TelaUsuario from "../pages/TelaUsuario";
import ListagemUsuarios from "../pages/ListagemUsuarios";

const Router: React.FC = () => (
	<IonReactRouter>
		<IonSplitPane contentId="main">
			<IonRouterOutlet id="main">
				<Route exact path="/">
					<Redirect to="/login" />
				</Route>
				<Route path="/login" component={Login} />
				<Route path="/primeiro-acesso" component={PrimeiroAcesso} />
				<PrivateRoute path="/anamnese" component={Anamnese} />
				<PrivateRoute path="/mudar-senha" component={MudarSenha} />
				<PrivateRoute path="/private" component={Tabs} />

				<PrivateRoute path="/aluno/cadastrar" component={CadastroAluno} />
				<PrivateRoute path="/aluno/listar" component={ListagemAlunos} />
				<PrivateRoute path="/aluno/visualizar/:idAluno" component={TelaAluno} />

				<PrivateRoute path="/usuario/cadastrar" component={CadastroUsuario} />
				<PrivateRoute
					path="/usuario/visualizar/:idUsuario"
					component={TelaUsuario}
				/>
				<PrivateRoute path="/usuario/listar" component={ListagemUsuarios} />

				<PrivateRoute path="/escola/cadastrar" component={CadastroEscola} />
				<PrivateRoute path="/escola/listar" component={ListagemEscolas} />
				<PrivateRoute path="/escola/visualizar/:idEscola" component={TelaEscola} />

				<PrivateRoute path="/turma/cadastrar" component={CadastroTurma} />
				<PrivateRoute path="/turma/listar" component={ListagemTurmas} />
				<PrivateRoute path="/turma/visualizar/:idTurma" component={TelaTurma} />
			</IonRouterOutlet>
		</IonSplitPane>
	</IonReactRouter>
);

export default Router;
