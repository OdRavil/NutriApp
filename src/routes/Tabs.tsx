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
import CadastroAluno from "../pages/CadastroAluno"

export const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/private" to="/private/home" />
        <Route exact path="/private/home" component={Home} />
        <Route exact path="/private/configuracao" component={Configuracao} />
        <Route exact path="/private/cadastroaluno" component={CadastroAluno}/>
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
        <IonTabButton tab="cadastro-aluno" href="/private/cadastroaluno">
          <IonIcon icon={home} />
          <IonLabel>CadastroAluno</IonLabel>
        </IonTabButton>
      </IonTabBar>
      
    </IonTabs>
  );
};
