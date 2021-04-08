import React, { useState, useEffect } from "react";
import { Avatar, ExpansionPanel } from "@material-ui/core";
import "./SidebarChat.css";
import db, { auth } from "./firebase";
import { Link, useHistory, useParams } from "react-router-dom";
import readOutLoud from "./Welcome";
import firebase from "firebase";
import { ExpandMore } from "@material-ui/icons";
import Delete from "./Delete.png";
import Delete2 from "./Delete2.svg";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

function SidebarChat({ addNewChat, name, id, display }) {
	const [seed, setSeed] = useState("");
	const [messages, setMessages] = useState([]);
	const [userchat, setUserchat] = useState([]);
	const [start, setStart] = useState();
	const history = useHistory();
	// const [dan, setDan] = useState("")
	const { roomId } = useParams();
	const [deleteRoom, setDeleteRoom] = useState([]);
	var user = auth.currentUser;

	useEffect(() => {
		if (id) {
			db.collection("users")
				.doc(`${user.phoneNumber}`)
				.collection("userchats")
				.doc(id)
				.collection("messages")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setMessages(snapshot.docs.map((doc) => doc.data()))
				);
		}
	}, [id]);

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
			.onSnapshot((snapshot) => setSeed(snapshot.data().imageUrl));
	}, [seed]);

	// console.log(id);

	const CreateChat = () => {
		db.collection("users")
			.doc(`${id}`)
			.collection("profiles")
			.doc(`${id}`)
			.set({
				imageUrl: "",
				// name: chatName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		const chatName = prompt("please enter name for chat");
		if (chatName) {
			db.collection("users")
				.doc(`${user.phoneNumber}`)
				.collection("/userchats/")
				.doc(`${chatName}`)
				.set({
					id: chatName,
					name: chatName,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				});
		}
	};

	const time = messages[0]?.timestamp;
	const dateobj = new Date(time * 1000);

	const timestamp = dateobj.toUTCString();

	// console.log("phoneid",id);

	const onRoomDelete = () => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(id)
			.collection("messages")
			// .get();
			.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.delete();
				});
			});

		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(id)
			.get()
			.then(function (doc) {
				// console.log(doc.id, "=>", doc.id);
				doc.ref.delete();
				history.push("/");
			});
	};

	// console.log(id, "id");
	// console.log(deleteRoom, "dleroom");

	return !addNewChat ? (
		<Link to={`/userchat/${name}`}>
			<div className="sidebarChat__main">
				<div className="sidebarChat__chat">
					{/* <Avatar src={seed === undefined ? <Avatar /> : seed} /> */}
					<Avatar src={seed == null ? <Avatar /> : seed} />
					<h4>
						{display != null ? display : name}
						<p>{messages[0]?.message}</p>
					</h4>
				</div>
				<div className="sidebarChat__time">
					{/* <img src="https://img.icons8.com/ios/50/000000/delete-forever--v2.png" /> */}
					<img
						style={{ height: "25px" }}
						src={Delete}
						onClick={() => {
							onRoomDelete(setDeleteRoom(id));
						}}
					/>
					{/* <DeleteIcon
						// <DeleteOutlineIcon
						style={{ color: "white" }}
						onClick={() => {
							onRoomDelete(setDeleteRoom(id));
						}}
					/> */}
					{/* <h4>{timestamp.slice(16, 25)}</h4> */}
					{/* <h4>{timestamp}</h4> */}
				</div>
			</div>
		</Link>
	) : (
		<div onClick={CreateChat} className="sidebarChat">
			<h2>Add new chat</h2>
		</div>
	);
}

export default SidebarChat;
