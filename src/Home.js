import React, { useEffect } from "react";
import "./Home.css";
import Sidebar from "./Sidebar";
import readOutLoud from "./Welcome";
import db, { auth } from "./firebase";

function Home() {
	const user = auth.currentUser;
	useEffect(() => {
		if (user) {
			// db.doc(`/users/${user.uid}`)
			db.doc(`/users/${user.phoneNumber}`)
				.get()
				.then((doc) => {
					// console.log(doc.user);
				})
				.then((token) => {
					// console.log(token);
				})
				.then((token) => {
					token = token;
					// db.collection("users")
					db.doc(`/users/${user.phoneNumber}`).set({
						// uid: user.uid,
						uid: user.phoneNumber,
						displayName: user.displayName,
						email: user.email,
					});
				});
		}
	}, [user]);

	// console.log(user.phoneNumber)

	// useEffect((name) => {
	// 	readOutLoud();
	// }, []);


	return (
		<div className="home">
			<Sidebar />
		</div>
	);
}

export default Home;
