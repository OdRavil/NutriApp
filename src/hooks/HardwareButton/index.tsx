import { useEffect } from "react";
import { useIonAlert } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

const useHardwareButton = () => {
	const [present, dismiss] = useIonAlert();

	useEffect(() => {
		if (Capacitor.isNativePlatform()) {
			App.addListener("backButton", (e) => {
				const { pathname } = window.location;

				if (pathname === "/") {
					App.exitApp();
				} else if (pathname.startsWith("/private")) {
					present({
						message: "Deseja sair do aplicativo?",
						buttons: [
							{
								text: "Não",
								handler: () => dismiss(),
							},
							{
								text: "Sim",
								handler: () => App.exitApp(),
							},
						],
						backdropDismiss: false,
					});
				} else if (e.canGoBack) {
					window.history.back();
				}
			});
		}
	}, [dismiss, present]);
};

export default useHardwareButton;
