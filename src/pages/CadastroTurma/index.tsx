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
	IonSelect,
	IonSelectOption,
	IonLoading,
	IonButtons,
	IonIcon,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/auth";
import Escola from "../../models/Escola";
import Turma from "../../models/Turma";
import Usuario, { TipoUsuario } from "../../models/Usuario";
import EscolaService from "../../services/EscolaService";
import TurmaService from "../../services/TurmaService";
import UsuarioService from "../../services/UsuarioService";

const CadastroTurma: React.FC<RouteComponentProps> = (props) => {
	const { auth } = useAuth();

	const [mensagemErrorBox, setMensagemErrorBox] = useState<string>("");
	const [showErrorBox, setShowErrorBox] = useState<boolean>(false);
	const [showSuccessBox, setShowSuccessBox] = useState<boolean>(false);
	const [codigo, setCodigo] = useState<string>("");
	const [descricao, setDescricao] = useState<string>("");
	const [idEscola, setIdEscola] = useState<string>();
	const [escolaLista, setEscolaLista] = useState<Escola[]>();

	const mostrarMensagemErro = (mensagem: string) => {
		setMensagemErrorBox(mensagem);
		setShowErrorBox(true);
	};

	const carregarEscola = useCallback(async (usuario: Usuario) => {
		if (usuario.tipo === TipoUsuario.ADMINISTRADOR) {
			new EscolaService().listar().then((escolas) => {
				setEscolaLista(escolas);
				if (!escolas || escolas.length === 0) {
					mostrarMensagemErro("Não existem escolas cadastradas.");
				}
			});
		} else {
			const escolasUsuario = usuario.listaEscola;
			if (!escolasUsuario || escolasUsuario.length === 0) {
				setEscolaLista([]);
				mostrarMensagemErro("Não existem escolas para este usuário.");
				return;
			}
			// Apenas as escolas que o usuário possui acesso
			new EscolaService().listar().then((escolas) => {
				const filtrado = escolas.filter((item) =>
					escolasUsuario.includes(item.id!)
				);
				setEscolaLista(filtrado);
				if (!filtrado || filtrado.length === 0) {
					mostrarMensagemErro("Não existem escolas para este usuário.");
				}
			});
		}
	}, []);

	const cadastrar = async () => {
		if (!codigo || codigo.trim().length === 0) {
			mostrarMensagemErro("Código não preenchido.");
			return;
		}
		if (!descricao || descricao.trim().length === 0) {
			mostrarMensagemErro("Descrição não preenchido.");
			return;
		}
		if (!idEscola || idEscola.trim().length === 0) {
			mostrarMensagemErro("Escola não selecionada.");
			return;
		}

		try {
			const turma: Turma = {
				codigo: codigo.trim(),
				descricao: descricao.trim(),
				idEscola,
			};
			await new TurmaService().pushData(turma);
			setCodigo("");
			setDescricao("");
			setIdEscola(undefined);
			setShowSuccessBox(true);
		} catch (error) {
			console.error(error);
			mostrarMensagemErro("Erro de conexão, tente novamente mais tarde.");
		}
	};

	useEffect(() => {
		if (!auth?.user?.id) return;
		new UsuarioService()
			.getById(auth.user.id)
			.then((usuario) => carregarEscola(usuario!));
	}, [auth?.user?.id, carregarEscola]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonIcon
							icon={chevronBack}
							size="large"
							onClick={() => {
								props.history.goBack();
							}}
						/>
					</IonButtons>
					<IonTitle>Cadastro de Turma</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen scrollY={false}>
				<IonLoading isOpen={!escolaLista} />
				<IonCard>
					<IonList lines="none">
						<IonItem>
							<IonInput
								className="input-config"
								value={codigo}
								placeholder="Código"
								onIonChange={(e) => setCodigo(e.detail.value!)}
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
						{escolaLista && (
							<IonItem className="item-config" lines="none">
								<IonSelect
									className="input-config"
									value={idEscola}
									placeholder="Escola"
									onIonChange={(e) => setIdEscola(e.detail.value)}
								>
									{escolaLista.map((item) => (
										<IonSelectOption key={item.id!} value={item.id!}>
											{item.nome}
										</IonSelectOption>
									))}
								</IonSelect>
							</IonItem>
						)}
					</IonList>
				</IonCard>
				<IonCard>
					<IonButton
						color="primary"
						expand="block"
						onClick={cadastrar}
						className="register-button"
						disabled={!escolaLista || escolaLista.length === 0}
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

export default CadastroTurma;
