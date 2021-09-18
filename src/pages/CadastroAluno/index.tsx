import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCardContent,
  IonToast,
  IonList,
  IonIcon,
} from "@ionic/react";
import UsuarioService from "../../services/UsuarioService";
import Usuario, { TipoUsuario } from "../../models/Usuario";
import { useState } from "react";
import { RouteComponentProps } from "react-router";
import { mailOutline, personOutline } from "ionicons/icons";

const CadastroAluno: React.FC<RouteComponentProps> = (props) => {
  const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
  const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
  const [nome, setNome] = useState<string>();
  const [email, setEmail] = useState<string>();

  const cadastrar = () => {
    if (!nome || nome.trim().length === 0) {
      mostrarMensagemErro("Nome não preenchido.");
      return;
    }
    if (!email || email.trim().length === 0) {
      mostrarMensagemErro("E-mail não preenchido.");
      return;
    }

    const usuario: Usuario = {
      tipo: TipoUsuario.ALUNO,
      nome: nome.trim(),
      email: email.trim(),
      turmaLista: [],
      primeiroAcesso: true,
    };

    {
      new UsuarioService()
        .pushData(usuario)
        .then((id) => {
          setNome("");
          setEmail("");
          setShowSuccessBox(true);
        })
        .catch((error) => {
          console.error(error);
          mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
        });
    }
  };

  const mostrarMensagemErro = (mensagem: string) => {
    setMensagemErrorBox(mensagem);
    setShowErrorBox(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de Aluno</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonCard>
          <IonList lines="none">
            <IonItem>
              <IonIcon className="icon-config" icon={personOutline} />
              <IonInput
                className="input-config"
                value={nome}
                placeholder="Nome do Aluno"
                onIonChange={(e) => setNome(e.detail.value!)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonIcon className="icon-config" icon={mailOutline} />
              <IonInput
                className="input-config"
                value={email}
                type="email"
                placeholder="E-mail do Aluno"
                onIonChange={(e) => setEmail(e.detail.value!)}
              ></IonInput>
            </IonItem>
          </IonList>
        </IonCard>
        <IonCard>
          <IonButton
            color="primary"
            expand="block"
            onClick={cadastrar}
            className="register-button"
          >
            Cadastrar
          </IonButton>
        </IonCard>
        <IonToast
          isOpen={showErrorBox}
          onDidDismiss={() => setShowErrorBox(false)}
          message={mensagemErrorBox}
          duration={1000}
          position="top"
          color="danger"
        />

        <IonToast
          isOpen={showSuccessBox}
          onDidDismiss={() => setShowSuccessBox(false)}
          message="Cadastrado com Sucesso."
          duration={700}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default CadastroAluno;
