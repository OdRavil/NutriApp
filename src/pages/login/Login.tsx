import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { loginUser } from '../../utils/Firebase';
import './Login.css';

const Login: React.FC = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login(){
    const res = await loginUser(email, password)
    console.log(`${res ? 'login success' : 'login filed'}`)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput 
          placeholder="E-mail"
          onIonChange={(e: any) => setEmail(e.target.value)}
        />
        <IonInput 
          placeholder="Password" 
          onIonChange={(e: any) => setPassword(e.target.value)}
        />
        <IonButton onClick={login}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
