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
} from "ionicons/icons";
import React from "react";
import { RouteComponentProps } from "react-router";
import firebase from "firebase/app";
import "firebase/firestore";
import "./index.css";
import { Sexo } from "../../models/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { validarEmail } from "../../utils/string";
import { getCurrentUser } from "../../utils/Firebase";

export interface ConfiguracaoProps {}
export interface ConfiguracaoState {
	emailAtual: string;
	sexoAtual: Sexo;
	nomeAtual: string;
	dataNascimentoAtual: string;
	mensagemToastErro: string;
	showToastErro: boolean;
	showToastSucesso: boolean;
	email: string;
	sexo: Sexo;
	nome: string;
	dataNascimento: string;
	showLoading: boolean;
	loginInvalido: boolean;
	emailInvalido: boolean;
	nomeInvalido: boolean;
	bloquearPagina: boolean;
}
class Configuracao extends React.Component<
	RouteComponentProps<ConfiguracaoProps>,
	ConfiguracaoState
> {
	constructor(props: RouteComponentProps<ConfiguracaoProps>) {
		super(props);
		this.state = {
			emailAtual: "",
			sexoAtual: Sexo.MASCULINO,
			nomeAtual: "",
			dataNascimentoAtual: "",
			mensagemToastErro: "",
			showToastErro: false,
			showToastSucesso: false,
			email: "",
			sexo: Sexo.MASCULINO,
			nome: "",
			dataNascimento: "",
			showLoading: true,
			loginInvalido: false,
			emailInvalido: false,
			nomeInvalido: false,
			bloquearPagina: false,
		};
	}

	componentDidMount() {
		getCurrentUser().then((usuario) => {
			if (!usuario) return;
			this.setState({
				showLoading: false,
				email: usuario.email || "",
				emailAtual: usuario.email || "",
				sexo: usuario.sexo || Sexo.MASCULINO,
				sexoAtual: usuario.sexo || Sexo.MASCULINO,
				nome: usuario.nome || "",
				nomeAtual: usuario.nome || "",
				dataNascimento: usuario.dataNascimento
					? usuario.dataNascimento.toDate().toISOString()
					: "",
				dataNascimentoAtual: usuario.dataNascimento
					? usuario.dataNascimento.toDate().toISOString()
					: "",
			});
		});
	}

	private getDadosParaAtualizar() {
		const data: any = {};
		this.state.emailAtual !== this.state.email && (data.email = this.state.email);
		this.state.sexoAtual !== this.state.sexo && (data.sexo = this.state.sexo);
		this.state.nomeAtual !== this.state.nome && (data.nome = this.state.nome);
		this.state.dataNascimentoAtual !== this.state.dataNascimento &&
			(data.dataNascimento = firebase.firestore.Timestamp.fromDate(
				new Date(this.state.dataNascimento)
			));
		return [data, data.email];
	}

	private async sair() {
		this.setState({ showLoading: true });
		await firebase
			.auth()
			.signOut()
			.then(() => {
				localStorage.clear();
				this.props.history.push("/");
			})
			.catch(console.error);
		this.setState({ showLoading: false });
	}

	private readonly usuarioService = new UsuarioService();

	private permitirSalvar(): boolean {
		return (
			!this.state.loginInvalido &&
			!this.state.nomeInvalido &&
			!this.state.emailInvalido
		);
	}

	private async salvar() {
		try {
			this.setState({ bloquearPagina: true });
			this.setState({ showLoading: true });
			const [data, email] = this.getDadosParaAtualizar();
			if (email) {
				try {
					await firebase.auth().currentUser!.updateEmail(email);
				} catch (error) {
					console.log(error);
					return;
				}
			}
			const id = localStorage.getItem("user")!;
			await this.usuarioService.updateData(id, data).catch(console.error);
		} catch (error) {
			console.error(error);
		} finally {
			this.setState({ showLoading: false });
			this.setState({ bloquearPagina: false });
		}
	}

	render() {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Configuração</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen scrollY={false}>
					<IonToast
						isOpen={this.state.showToastSucesso}
						onDidDismiss={() => this.setState({ showToastSucesso: false })}
						message="Configurações atualizadas!"
						duration={600}
					/>
					<IonToast
						isOpen={this.state.showToastErro}
						onDidDismiss={() => this.setState({ showToastErro: false })}
						message={this.state.mensagemToastErro}
						duration={600}
					/>
					<IonLoading
						isOpen={this.state.showLoading}
						onDidDismiss={() => this.setState({ showLoading: false })}
					/>
					<IonCard>
						<IonList>
							<IonItem className="item-config" lines="none">
								<IonIcon className="icon-config" icon={mailOutline} />
								<IonInput
									className="input-config"
									color={this.state.emailInvalido ? "danger" : "default"}
									value={this.state.email}
									onIonChange={(e) => {
										const value = e.detail.value!;
										this.setState({
											email: value,
											emailInvalido: !value || value.length === 0 || !validarEmail(value),
										});
									}}
									placeholder="E-mail"
									type="email"
									disabled={this.state.bloquearPagina}
								/>
							</IonItem>
						</IonList>
					</IonCard>
					<IonCard>
						<IonList>
							<IonItem className="item-config" lines="none">
								<IonIcon className="icon-config" icon={maleFemaleOutline} />
								<IonSelect
									className="input-config"
									value={this.state.sexo}
									placeholder="Sexo"
									onIonChange={(e) => this.setState({ sexo: e.detail.value })}
									disabled={this.state.bloquearPagina}
								>
									<IonSelectOption value={Sexo.FEMININO}>Feminino</IonSelectOption>
									<IonSelectOption value={Sexo.MASCULINO}>Masculino</IonSelectOption>
								</IonSelect>
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonIcon className="icon-config" icon={manOutline} />
								<IonInput
									className="input-config"
									color={this.state.nomeInvalido ? "danger" : "default"}
									value={this.state.nome}
									onIonChange={(e) => {
										const value = e.detail.value!;
										this.setState({
											nome: value,
											nomeInvalido: !value || value.length === 0,
										});
									}}
									placeholder="Nome"
									type="text"
									disabled={this.state.bloquearPagina}
								/>
							</IonItem>
							<IonItem className="item-config" lines="none">
								<IonIcon className="icon-config" icon={calendarOutline} />
								<IonDatetime
									value={this.state.dataNascimento}
									onIonChange={(e) => this.setState({ dataNascimento: e.detail.value! })}
									displayFormat="DD/MM/YYYY"
									className="input-config"
									placeholder="Data de nascimento"
									disabled={this.state.bloquearPagina}
								/>
							</IonItem>
						</IonList>
					</IonCard>
					<IonCard>
						<IonButton
							color="primary"
							expand="block"
							routerLink="/mudar-senha"
							disabled={this.state.bloquearPagina}
						>
							Mudar senha
						</IonButton>
					</IonCard>
					<IonCard>
						<IonButton
							color="primary"
							expand="block"
							onClick={() => this.salvar()}
							disabled={this.state.bloquearPagina || !this.permitirSalvar()}
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
							this.sair();
						}}
					>
						Sair
					</IonButton>
				</IonCard>
			</IonPage>
		);
	}
}

export default Configuracao;
