import firebase from "firebase/app";
import "firebase/auth";

// eslint-disable-next-line import/extensions
const config = require("./firebase.json");

const initFirebaseApp = (): void => {
	if (firebase.apps.length === 0) {
		firebase.initializeApp(config);
	}
};

initFirebaseApp();

export default initFirebaseApp;
