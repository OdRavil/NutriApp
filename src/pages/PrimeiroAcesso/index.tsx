import {
  IonButton,
  IonCard,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  calendarOutline,
  mailOutline,
  maleFemaleOutline,
  manOutline,
  personOutline,
} from "ionicons/icons";
import { Sexo, TipoUsuario } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./index.css";
import { RouteComponentProps } from "react-router";

const PrimeiroAcesso: React.FC<RouteComponentProps> = (props) => {

  const sair = () => {
  localStorage.clear();
  console.log(props);
  props.history.push("/");
  };

  const [login, setLogin] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [senha, setSenha] = useState<string>();

 const salvar = async() => {

  const user = await new UsuarioService().getUserByEmail(email!);

  if (!user) {
    //TODO
  } else {
    const usuario = {
    
    login: login,
    email: email,
    senha: senha
    }
    new UsuarioService().updateData(user.id, usuario);
    };
    
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configuração</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonCard>
          <IonList>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={mailOutline} />
              <IonInput
                className="input-config"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                placeholder="E-mail"
                type="email"
              ></IonInput>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={personOutline} />
              <IonInput
                className="input-config"
                value={login}
                onIonChange={(e) => setLogin(e.detail.value!)}
                placeholder="Login"
                type="text"
              ></IonInput>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={mailOutline} />
              <IonInput
                className="input-config"
                value={senha}
                onIonChange={(e) => setSenha(e.detail.value!)}
                placeholder="Senha"
                type="password"
              ></IonInput>
            </IonItem>
          </IonList>
        </IonCard>
        <IonCard>
          <IonButton
            color="primary"
            expand="block"
            onClick={() => {
              salvar();
            }}
          >
            Salvar
          </IonButton>
        </IonCard>
      </IonContent>
      <IonCard>
        <IonButton
          color="danger"
          expand="block"
          onClick={() => {
            sair();
          }}
        >
          Sair
        </IonButton>
      </IonCard>
    </IonPage>
  );
};

export default PrimeiroAcesso;
