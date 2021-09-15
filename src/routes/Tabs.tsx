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
import { home, settings } from "ionicons/icons";

import Home from "../pages/Home";
import Configuracao from "../pages/Configuracao";

export const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/private" to="/private/home" />
        <Route exact={true} path="/private/home" component={Home} />
        <Route exact={true} path="/private/configuracao" component={Configuracao} />
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
      </IonTabBar>
    </IonTabs>
  );
};
