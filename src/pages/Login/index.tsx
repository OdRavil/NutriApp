import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { RouteComponentProps } from "react-router";
import { loginUser } from "../../utils/Firebase";
import "./index.css";
import Image from '../../assets/login.jpg'

const Login: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const mostrarMensagemErro = (mensagem: string) => {
    setMensagemErrorBox(mensagem);
    setShowErrorBox(true);
  };

  const login = async () => {
    try {
      setShowLoading(true);
      await loginUser(email, password)
        .then((credentials) => {
          if (!credentials.user) {
            mostrarMensagemErro("Não foi possível logar usuário.");
            return;
          }
          props.history.push("private/home");
        })
        .catch((error) => {
          console.error(error);
          mostrarMensagemErro(error);
        });
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonImg className="i-l" />
      <IonContent className="ion-padding c-f-l">
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
        <IonToast
          isOpen={showErrorBox}
          onDidDismiss={() => setShowErrorBox(false)}
          message={mensagemErrorBox}
          duration={1000}
          position="bottom"
          color="danger"
        />
        <IonInput
          placeholder="E-mail"
          type="email"
          onIonChange={(e: any) => setEmail(e.target.value)}
          className="i-s-l"
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonChange={(e: any) => setPassword(e.target.value)}
          className="i-s-l"
        />
        <IonContent>
          <IonButton className="l-b-s" onClick={login}>Login</IonButton>
          <IonButton className="f-a-b-s" routerLink="/primeiro-acesso">Primeiro acesso?</IonButton>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Login;
