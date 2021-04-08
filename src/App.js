import React, { useEffect, useDispatch, useState } from "react";
import "./App.css";
import Profile from "./Profile";
import Login from "./Login";
import Chat from "./Chat";
import db, { auth, storage } from "./firebase";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Home from "./Home";
import Particles from "react-particles-js";
import Demo from "./Demo";
import firebase from "firebase";
import { Online } from "react-detect-offline";
import getRealtimeUsers from "./user.actions";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import Contacts from "./Contacts";
import ContactsHome from "./ContactsHome";
import NotificationHome from "./NotificationHome";
import Notification from "./Notification";
import AddDisplay from "./AddDisplay";
import AddDisplayBack from "./AddDisplayBack";
import AddContactsBack from "./AddContactsBack";

import Entry from "./Entry";

function App() {
	const [{ user }, dispatch] = useStateValue([]);
	// const user = auth.currentUser;
	const usersRef = db.collection("users");
	const history = useHistory();
	const [displayName, setDisplay] = useState("");
	// const dispatch = getRealtimeUsers([]);

	const uid = auth.currentUser;

	useEffect(() => {
		if (displayName) {
			db.collection("users")
				.doc(user.phoneNumber)
				.collection("profiles")
				.doc("displayName")
				.onSnapshot((snapshot) => setDisplay(snapshot.data().displayName));
		}
	}, [user]);

	return (
		<div className={`${!user ? "app__back" : "app"}`}>
			{!user ? (
				<Router>
					<Switch>
						<Route path="/">
							<Demo />
						</Route>
					</Switch>
				</Router>
			) : (
				<Entry />
			)}

			{/* <Router>
				<Switch>
					<Route path="/Logout">
						<Demo />
					</Route>
				</Switch>
			</Router> */}
		</div>
	);
}

export default App;
