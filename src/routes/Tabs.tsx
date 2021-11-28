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
import { home, informationCircle, settings } from "ionicons/icons";

import Home from "../pages/Home";
import Configuracao from "../pages/Configuracao";
import Sobre from "../pages/Sobre";

const Tabs: React.FC = () => (
	<IonTabs>
		<IonRouterOutlet>
			<Redirect exact path="/private" to="/private/home" />
			<Route exact path="/private/home" component={Home} />
			<Route exact path="/private/configuracao" component={Configuracao} />
			<Route exact path="/private/sobre" component={Sobre} />
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
			<IonTabButton tab="sobre" href="/private/sobre">
				<IonIcon icon={informationCircle} />
				<IonLabel>Sobre</IonLabel>
			</IonTabButton>
		</IonTabBar>
	</IonTabs>
);

export default Tabs;
