import React from "react";
import { IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { Tabs } from "./Tabs";
import Login from "../pages/Login";
import PrimeiroAcesso from "../pages/PrimeiroAcesso";
import CadastroAluno from "../pages/CadastroAluno";

const Router: React.FC = () => (
  <IonReactRouter>
    <IonSplitPane contentId="main">
      <IonRouterOutlet id="main">
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/primeiro-acesso" component={PrimeiroAcesso} />
        <Route path="/private" component={Tabs} />
        <Route path="/private/cadastro-aluno" component={CadastroAluno} />
      </IonRouterOutlet>
    </IonSplitPane>
  </IonReactRouter>
);

export default Router;
