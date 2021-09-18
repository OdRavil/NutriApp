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
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  calendarOutline,
  mailOutline,
  maleFemaleOutline,
  manOutline,
  personOutline,
} from "ionicons/icons";
import Usuario, { Sexo } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./index.css";
import { RouteComponentProps } from "react-router";
import { validarEmail } from "../../utils/string";

const usuarioService = new UsuarioService();

const Configuracao: React.FC<RouteComponentProps> = (props) => {
  const usuarioPlain = localStorage.getItem("user");
  const usuario: Usuario = JSON.parse(usuarioPlain || "{}");
  const uid = usuario.uid;

  const loginAtual = usuario.login;
  const emailAtual = usuario.email;
  const sexoAtual = usuario.sexo;
  const nomeAtual = usuario.nome;
  const dataNascimentoAtual = !usuario.dataNascimento
    ? ""
    : usuario.dataNascimento.toDate().toISOString();

  const [mensagemToastErro, setMensagemToastErro] = useState<string>("");
  const [showToastErro, setShowToastErro] = useState<boolean>(false);
  const [showToastSucesso, setShowToastSucesso] = useState<boolean>(false);

  const [login, setLogin] = useState<string>(usuario.login);
  const [email, setEmail] = useState<string>(usuario.email);
  const [sexo, setSexo] = useState<string>(usuario.sexo);
  const [nome, setNome] = useState<string>(usuario.nome);
  const [dataNascimento, setDataNascimento] = useState<string>(
    usuario.dataNascimento.toDate().toISOString()
  );
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const [loginInvalido, setLoginInvalido] = useState<boolean>(false);
  const [emailInvalido, setEmailInvalido] = useState<boolean>(false);
  const [nomeInvalido, setNomeInvalido] = useState<boolean>(false);

  const [bloquearPagina, setBloquearPagina] = useState<boolean>(false);

  const sair = async () => {
    setShowLoading(true);
    await firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.clear();
        props.history.push("/");
      })
      .catch(console.error);
    setShowLoading(false);
  };

  const getDadosParaAtualizar = () => {
    const data: any = {};
    loginAtual !== login && (data["login"] = login);
    emailAtual !== email && (data["email"] = email);
    sexoAtual !== sexo && (data["sexo"] = sexo);
    nomeAtual !== nome && (data["nome"] = nome);
    dataNascimentoAtual !== dataNascimento &&
      (data["dataNascimento"] = firebase.firestore.Timestamp.fromDate(
        new Date(dataNascimento)
      ));
    return [data, data["email"]];
  };

  const permitirSalvar = (): boolean =>
    !loginInvalido && !nomeInvalido && !emailInvalido;

  const salvar = async () => {
    try {
      setBloquearPagina(true);
      setShowLoading(true);
      const [data, email] = getDadosParaAtualizar();
      if (email) {
        await firebase
          .auth()
          .currentUser!.updateEmail(email)
          .then(async () => {
            return usuarioService.updateData(uid, data).catch(console.error);
          })
          .catch(console.error);
      } else {
        await usuarioService.updateData(uid, data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
      setBloquearPagina(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configuração</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonToast
          isOpen={showToastSucesso}
          onDidDismiss={() => setShowToastSucesso(false)}
          message="Configurações atualizadas!"
          duration={600}
        />
        <IonToast
          isOpen={showToastErro}
          onDidDismiss={() => setShowToastErro(false)}
          message={mensagemToastErro}
          duration={600}
        />
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
        <IonCard>
          <IonList>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={personOutline} />
              <IonInput
                className="input-config"
                value={login}
                color={loginInvalido ? "danger" : "default"}
                onIonChange={(e) => {
                  const value = e.detail.value!;
                  setLoginInvalido(!value || value.length === 0);
                  setLogin(value);
                }}
                placeholder="Login"
                type="text"
                disabled={!bloquearPagina}
              ></IonInput>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={mailOutline} />
              <IonInput
                className="input-config"
                color={emailInvalido ? "danger" : "default"}
                value={email}
                onIonChange={(e) => {
                  const value = e.detail.value!;
                  setEmailInvalido(
                    !value || value.length === 0 || validarEmail(value)
                  );
                  setEmail(value);
                }}
                placeholder="E-mail"
                type="email"
                disabled={!bloquearPagina}
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
                disabled={!bloquearPagina}
              >
                <IonSelectOption value={Sexo.FEMININO}>
                  Femenino
                </IonSelectOption>
                <IonSelectOption value={Sexo.MASCULINO}>
                  Masculino
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className="item-config" lines="none">
              <IonIcon className="icon-config" icon={manOutline} />
              <IonInput
                className="input-config"
                color={nomeInvalido ? "danger" : "default"}
                value={nome}
                onIonChange={(e) => {
                  const value = e.detail.value!;
                  setNomeInvalido(!value || value.length === 0);
                  setNome(value);
                }}
                placeholder="Nome"
                type="text"
                disabled={!bloquearPagina}
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
                disabled={!bloquearPagina}
              ></IonDatetime>
            </IonItem>
          </IonList>
        </IonCard>
        <IonCard>
          <IonButton
            color="primary"
            expand="block"
            routerLink="/mudar-senha"
            disabled={!bloquearPagina}
          >
            Mudar senha
          </IonButton>
        </IonCard>
        <IonCard>
          <IonButton
            color="primary"
            expand="block"
            onClick={() => salvar()}
            disabled={!bloquearPagina || !permitirSalvar()}
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
