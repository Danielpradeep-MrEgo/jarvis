import React, { useEffect, useDispatch, useState } from "react";
import "./Entry.css";
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

function EntryOne() {

    const user = auth.currentUser;

	return (
		<div className="entry">
			<Router>
				<Switch>
					<Route path="/Logout">
						<h1>Logged Out</h1>
						<Link to="/" exact>
							{/* <Button>Login??</Button> */}
							<Demo />
						</Link>
					</Route>
					<Route path="/" exact>
						<Profile />
						<Home name={user.displayName} />
					</Route>

					<Route path="/userchat/:userId/">
						<Profile />
						<Home />
						<Chat />
					</Route>

					<Route path="/Contacts">
						<Profile />
						<ContactsHome />
					</Route>

					<Route path="/AddContacts">
						<Profile />
						<ContactsHome />
						<AddContactsBack />
					</Route>

					<Route path="/AddDisplay">
						<Profile />
						<ContactsHome />
						<AddDisplayBack />
					</Route>

					<Route path="/Notifications">
						<Profile />
						<NotificationHome />
						<Notification />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default EntryOne;
