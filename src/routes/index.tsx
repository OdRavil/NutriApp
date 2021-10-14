import React from "react";
import { IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { Tabs } from "./Tabs";
import Login from "../pages/Login";
import MudarSenha from "../pages/Configuracao/MudarSenha";
import PrimeiroAcesso from "../pages/PrimeiroAcesso";

const Router: React.FC = () => (
	<IonReactRouter>
		<IonSplitPane contentId="main">
			<IonRouterOutlet id="main">
				<Route exact path="/">
					<Redirect to="/login" />
				</Route>
				<Route path="/login" component={Login} />
				<Route path="/mudar-senha" component={MudarSenha} />
				<Route path="/primeiro-acesso" component={PrimeiroAcesso} />
				<Route path="/private" component={Tabs} />
			</IonRouterOutlet>
		</IonSplitPane>
	</IonReactRouter>
);

export default Router;
