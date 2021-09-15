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
  IonCardContent,
  IonToast
} from "@ionic/react";
import {
  calendarOutline,
  mailOutline,
  maleFemaleOutline,
  manOutline,
  personOutline,
} from "ionicons/icons";
import UsuarioService from "../../services/UsuarioService";
import { TipoUsuario } from "../../models/Usuario";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./index.css";
import { RouteComponentProps } from "react-router";

const CadastroAluno: React.FC<RouteComponentProps> = (props) => {

  const [registerError, showErrorBox] = useState(false);  
  const [registerSuccess, showSuccessBox] = useState(false);  
  const [nome, setNome] = useState<string>();
  const [email, setEmail] = useState<string>();  

  const cadastrar = () => {
    const usuario = {
      tipo: TipoUsuario.ALUNO, 
      nome: nome,
      email: email
    };

{    new UsuarioService().pushData(usuario).then((id)=>{
          
      setNome('');
      setEmail('');
      showSuccessBox(true);
    }).catch(
      ()=>{showErrorBox(true);}
    );
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de Aluno</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent>
            <IonCard className="register-area">
                <IonCardContent>
                <IonItem>
                    <IonInput value={nome} placeholder="Nome do Aluno" onIonChange={(e) => setNome(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput value={email} type='email' placeholder="E-mail do Aluno" onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                </IonItem>
                </IonCardContent>
                <IonButton onClick={cadastrar} className="register-button">
                    Cadastrar
                </IonButton>
            </IonCard>
            <IonToast
              cssClass="result-button"
              isOpen={registerError}
              onDidDismiss={() => showErrorBox(false)}
              message="Falha no Cadastro, tente novamente."
              duration={60000}
              position="middle"
              color="danger"
            />

           <IonToast
              isOpen={registerSuccess}
              onDidDismiss={() => showSuccessBox(false)}
              message="Cadastrado com Sucesso."
              duration={60000}
            />

        </IonContent>
     
    </IonPage>
  );
};

export default CadastroAluno;
