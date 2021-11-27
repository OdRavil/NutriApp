import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonItem,
	IonList,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import { RouteComponentProps } from "react-router";
import "./index.css";

const Sobre: React.FC<RouteComponentProps> = ({ history }) => (
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonButtons slot="start">
					<IonButton onClick={() => history.goBack()}>
						<IonIcon slot="icon-only" icon={chevronBack} />
					</IonButton>
				</IonButtons>
				<IonTitle />
			</IonToolbar>
		</IonHeader>
		<IonContent fullscreen className="ion-padding ion-text-center">
			<IonGrid>
				<IonRow className="ion-justify-content-center">
					{/* <IonCard className="ion-padding"> */}
					<IonCol>
						<img style={{ maxHeight: "5em" }} alt="" src="./assets/unijui.png" />
					</IonCol>
					{/* </IonCard> */}
					{/* <IonCard style={{ borderTop: "500px" }} className="ion-padding"> */}
					<IonCol>
						<img style={{ maxHeight: "5em" }} alt="" src="./assets/cc.png" />
					</IonCol>
					{/* </IonCard> */}
				</IonRow>
				<IonRow>
					<IonCol>
						<IonItem lines="none">
							<p className="ion-text-center">
								Aplicação desenvolvida por alunos da Universidade Regional do Noroeste
								do Estado do Rio Grande do Sul, Unijuí.
							</p>
						</IonItem>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol>
						<IonCard style={{ backgroundColor: "#7cc204" }}>
							<IonCardHeader>
								<IonCardSubtitle className="ion-text-left" style={{ color: "#fff" }}>
									Alunos
								</IonCardSubtitle>
							</IonCardHeader>
							<div style={{ height: "7px", backgroundColor: "#fff" }} />
							<IonList style={{ backgroundColor: "#7cc204" }}>
								<IonItem color="secundary" style={{ color: "#fff" }} lines="none">
									Rodrigo Pillar Vianna
								</IonItem>
								<IonItem color="secundary" style={{ color: "#fff" }} lines="none">
									Eduardo Augusto Morgentern
								</IonItem>
								<IonItem color="secundary" style={{ color: "#fff" }} lines="none">
									Leonardo Diniz
								</IonItem>
								<IonItem color="secundary" style={{ color: "#fff" }} lines="none">
									Vinícius Mânica
								</IonItem>
							</IonList>
						</IonCard>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonContent>
	</IonPage>
);

export default Sobre;
