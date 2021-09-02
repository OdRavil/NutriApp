import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logIn } from "ionicons/icons";
import "./index.css";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton href="/private">
          <IonIcon icon={logIn} />
          <IonLabel>Login</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
