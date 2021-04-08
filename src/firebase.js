import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD_x1hRiwYw2UdkDyDl6DgmvqbIZyMv-Lc",
	authDomain: "jarvis-ai-3c8d2.firebaseapp.com",
	projectId: "jarvis-ai-3c8d2",
	storageBucket: "jarvis-ai-3c8d2.appspot.com",
	messagingSenderId: "142955491418",
	appId: "1:142955491418:web:a81020f951c7cda16da863",
	measurementId: "G-55J5D8NDC5",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
const oldRealTimeDb = firebase.storage();

export { auth, provider, storage, oldRealTimeDb };
export default db;
