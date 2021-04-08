import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import "./SideContacts.css";
import db, { auth } from "./firebase";
import { Link } from "react-router-dom";

function SideContacts({ addNewChat, name, id, display }) {
	const [messages, setMessages] = useState([]);
	const [userchat, setUserchat] = useState([]);
	const [dan, setDan] = useState("");
	var user = auth.currentUser;
	const [seed, setSeed] = useState([]);

	useEffect(() => {
		if (id) {
			db.collection("users")
				.doc(`${user.uid}`)
				.collection("userchats")
				.doc(id)
				.collection("messages")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setMessages(snapshot.docs.map((doc) => doc.data()))
				);
		}
	}, [id]);
	// console.log(id);

	useEffect(() => {
		if (id) {
			db.collection("users")
				.doc(id)
				.collection("userchats")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setUserchat(snapshot.docs.map((doc) => doc.data()))
				);
		}
	}, [id]);

	useEffect(() => {
		db.collection("users")
			.doc(id)
			.collection("profiles")
			.doc(id)
			.onSnapshot((snapshot) => setSeed(snapshot.data()));
	}, [seed != undefined]);
	return (
		<div>
			<Link to={`/userchat/${name}`}>
				<div className="sidecont__chat">
					<Avatar src={seed} />

					<span
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h4 style={{ color: "white" }}>
							{display}
							<br />
							<span className="span__id">{id}</span>
						</h4>
					</span>
					{/* </div> */}
				</div>
			</Link>
		</div>
	);
}

export default SideContacts;
