import {
	IonCol,
	IonContent,
	IonGrid,
	IonPage,
	IonRow,
	useIonRouter,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useAuth } from "../../context/auth";

const Welcome: React.FC = () => {
	const router = useIonRouter();

	const { signed } = useAuth();

	useEffect(() => {
		if (signed) {
			router.push("/private/home", "none", "replace");
		} else {
			router.push("/login", "none", "replace");
		}
	}, [signed]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<IonPage>
			<IonContent
				fullscreen
				className="ion-padding ion-text-center"
				scrollY={false}
			>
				<IonGrid>
					<IonRow>
						<IonCol>
							<img
								style={{ maxHeight: "70em" }}
								alt=""
								src="./assets/logo_healthteens-01.png"
							/>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Welcome;
