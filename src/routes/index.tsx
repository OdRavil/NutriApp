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
import EsqueciMinhaSenha from "../pages/EsqueciMinhaSenha";
import useHardwareButton from "../hooks/HardwareButton";
import useAuthSigned from "../hooks/AuthSigned";
import Welcome from "../pages/Welcome";

const Router: React.FC = () => {
	const isSigned = useAuthSigned();

	useHardwareButton();

	return (
		<IonReactRouter>
			<IonSplitPane contentId="main">
				<IonRouterOutlet id="main">
					<Route path="/" component={Welcome} exact />
					<Route path="/login/esqueci-senha" component={EsqueciMinhaSenha} exact />
					<Route path="/login/primeiro-acesso" component={PrimeiroAcesso} exact />
					<Route path="/login" component={Login} exact />
					<Route path="/private" component={Tabs} />
					<PrivateRoute
						signed={isSigned}
						path="/anamnese"
						component={Anamnese}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/mudar-senha"
						component={MudarSenha}
						exact
					/>

					<PrivateRoute
						signed={isSigned}
						path="/aluno/cadastrar"
						component={CadastroAluno}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/aluno/listar"
						component={ListagemAlunos}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/aluno/visualizar/:idAluno"
						component={TelaAluno}
						exact
					/>

					<PrivateRoute
						signed={isSigned}
						path="/usuario/cadastrar"
						component={CadastroUsuario}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/usuario/visualizar/:idUsuario"
						component={TelaUsuario}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/usuario/listar"
						component={ListagemUsuarios}
						exact
					/>

					<PrivateRoute
						signed={isSigned}
						path="/escola/cadastrar"
						component={CadastroEscola}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/escola/listar"
						component={ListagemEscolas}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/escola/visualizar/:idEscola"
						component={TelaEscola}
						exact
					/>

					<PrivateRoute
						signed={isSigned}
						path="/turma/cadastrar"
						component={CadastroTurma}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/turma/listar"
						component={ListagemTurmas}
						exact
					/>
					<PrivateRoute
						signed={isSigned}
						path="/turma/visualizar/:idTurma"
						component={TelaTurma}
						exact
					/>
					{/* Fallback redirect */}
					<Route render={() => <Redirect to="/" />} />
				</IonRouterOutlet>
			</IonSplitPane>
		</IonReactRouter>
	);
};

export default Router;
