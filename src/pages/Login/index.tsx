import {
  IonButton,
  IonContent,
  IonHeader,
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonChange={(e: any) => setPassword(e.target.value)}
        />
        <IonButton onClick={login}>Login</IonButton>
        <IonButton routerLink="/primeiro-acesso">Primeiro acesso?</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
