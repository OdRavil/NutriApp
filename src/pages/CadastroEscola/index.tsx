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
  IonToast,
  IonList,
  IonTextarea,
} from "@ionic/react";
import { useState } from "react";
import { RouteComponentProps } from "react-router";
import Escola from "../../models/Escola";
import EscolaService from "../../services/EscolaService";

const CadastroEscola: React.FC<RouteComponentProps> = (props) => {
  const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
  const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const cadastrar = async () => {
    if (!nome || nome.trim().length === 0) {
      mostrarMensagemErro("Nome não preenchido.");
      return;
    }
    if (!descricao || descricao.trim().length === 0) {
      mostrarMensagemErro("Descrição não preenchida.");
      return;
    }

    try {
      const escola: Escola = {
        nome: nome.trim(),
        descricao: descricao.trim(),
      };
      await new EscolaService().pushData(escola);
      setNome("");
      setDescricao("");
      setShowSuccessBox(true);
    } catch (error) {
      console.error(error);
      mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
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
          <IonTitle>Cadastro de Escola</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonCard>
          <IonList lines="none">
            <IonItem>
              <IonInput
                className="input-config"
                value={nome}
                placeholder="Nome"
                onIonChange={(e) => setNome(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                className="input-config"
                value={descricao}
                placeholder="Descrição"
                onIonChange={(e) => setDescricao(e.detail.value!)}
              />
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

export default CadastroEscola;
