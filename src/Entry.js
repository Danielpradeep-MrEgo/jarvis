import React, { useEffect, useDispatch, useState } from "react";
// import "./Entry.css";
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
import EntryTwo from "./EntryTwo";
import EntryOne from "./EntryOne";

function Entry() {
	// const [{ user }, dispatch] = useStateValue([]);
	const [display, setDisplay] = useState("");
	const history = useHistory();

	const user = auth.currentUser;

	useEffect(() => {
		if (display === null) {
			history.push("/")
		}
	})

	useEffect(() => {
		// if (displayName) {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.onSnapshot((snapshot) => setDisplay(snapshot.data().displayName));
		// }
	});

	// console.log(display, "name");
	return <div>{display ? <EntryOne /> : <EntryTwo />}</div>;
}

export default Entry;
