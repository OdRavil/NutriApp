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

const Configuracao: React.FC = () => {
  //TODO: Pegar ID do storage
  const uid = "C1CW8Z7Qx22ZAuz2iGT1";
  //TODO: Pegar Usuário do Storage
  const usuario = {
    dataNascimento: firebase.firestore.Timestamp.fromDate(
      new Date("1998-09-02T02:08:06.557Z")
    ),
    nome: "José Carvalho",
    login: "jose.carvalho",
    sexo: Sexo.MASCULINO,
    tipo: TipoUsuario.ALUNO,
    email: "jose.carvalho@teste.com",
  };

  const [login, setLogin] = useState<string>(usuario.login);
  const [senha, setSenha] = useState<string>(); //TODO: Nova senha no auth
  const [email, setEmail] = useState<string>(usuario.email);
  const [sexo, setSexo] = useState<string>(usuario.sexo);
  const [nome, setNome] = useState<string>(usuario.nome);
  const [dataNascimento, setDataNascimento] = useState<string>(
    usuario.dataNascimento.toDate().toISOString()
  );

  const mudarSenha = () => {}; //TODO: Mudar senha

  const sair = () => {}; //TODO: Deslogar do app

  const salvar = () => {
    const usuario = {
      dataNascimento: firebase.firestore.Timestamp.fromDate(
        new Date(dataNascimento)
      ),
      nome: nome,
      login: login,
      sexo: sexo === "M" ? Sexo.MASCULINO : Sexo.FEMININO,
      tipo: TipoUsuario.ALUNO,
      email: email,
    };
    new UsuarioService().updateData(uid, usuario);
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
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                placeholder="E-mail"
                type="email"
              ></IonInput>
            </IonItem>
          </IonList>
        </IonCard>
        <IonCard>
          <IonList>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={maleFemaleOutline} />
              <IonSelect
                className="input-config"
                value={sexo}
                placeholder="Sexo"
                onIonChange={(e) => setSexo(e.detail.value)}
              >
                <IonSelectOption value="F">Femenino</IonSelectOption>
                <IonSelectOption value="M">Masculino</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={manOutline} />
              <IonInput
                className="input-config"
                value={nome}
                onIonChange={(e) => setNome(e.detail.value!)}
                placeholder="Nome"
                type="text"
              ></IonInput>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={calendarOutline} />
              <IonDatetime
                value={dataNascimento}
                onIonChange={(e) => setDataNascimento(e.detail.value!)}
                displayFormat="DD/MM/YYYY"
                className="input-config"
                placeholder="Data de nascimento"
              ></IonDatetime>
            </IonItem>
          </IonList>
        </IonCard>
        <IonCard>
          <IonButton
            color="primary"
            expand="block"
            onClick={() => {
              mudarSenha();
            }}
          >
            Mudar senha
          </IonButton>
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

export default Configuracao;
