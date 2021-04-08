import React, { useEffect, useDispatch, useState } from "react";
import "./Entry.css";
import ProfileOne from "./ProfileOne";
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

function EntryTwo() {
    const user = auth.currentUser;

	return (
		<div className="entry">
			<Router>
				<Switch>
					<Route>
						<ProfileOne />
						<Home />
						<AddDisplayBack />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default EntryTwo;
