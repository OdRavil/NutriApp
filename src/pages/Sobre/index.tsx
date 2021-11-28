import {
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCol,
	IonContent,
	IonGrid,
	IonItem,
	IonList,
	IonPage,
	IonRow,
} from "@ionic/react";
import React from "react";
import "./index.css";

const Sobre: React.FC = () => (
	<IonPage>
		<IonContent fullscreen className="ion-padding ion-text-center">
			<IonGrid>
				<IonRow className="ion-justify-content-center">
					<IonCol>
						<img style={{ maxHeight: "5em" }} alt="" src="./assets/unijui.png" />
					</IonCol>
					<IonCol>
						<img style={{ maxHeight: "5em" }} alt="" src="./assets/cc.png" />
					</IonCol>
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
									Leonardo Diniz Schlueter
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
