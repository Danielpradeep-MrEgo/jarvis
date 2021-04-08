import { auth } from "./firebase";
import firebase from "firebase";

export const getRealtimeUsers = () => {
	return async (dispatch) => {
		dispatch({ type: auth.GET_REALTIME_USERS_REQUEST });

		const db = firebase.firestore();
		db.collection("users")
			// .where("state", "==", "")
			.onSnapshot((querySnapshot) => {
				const users = [];
				querySnapshot.forEach(function (doc) {
					users.push(doc.data());
				});
				console.log(users);
			});
	};
};

// export default getRealtimeUsers;
