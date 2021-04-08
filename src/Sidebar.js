import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import { Link, useParams } from "react-router-dom";
import Search from "@material-ui/icons/Search";
import chatIcon1 from "./chatIcon1.svg";
import notifi from "./notifi.svg";
import people1 from "./people1.svg";
import people from "./people.svg";
import peoples from "./peoples.svg";
import firebase from "firebase";
import { auth } from "./firebase";
import readOutLoud from "./Welcome";
import contact from "./contact.svg";

function Sidebar() {
	const [chats, setChats] = useState([]);
	const [userchats, setUserchats] = useState([]);
	const [{}, dispatch] = useStateValue();
	const [users, setUsers] = useState([]);
	const { userId } = useParams();
	const { userchat } = useParams();
	const [dan, setDan] = useState("");
	const [search, setSearch] = useState("");
	const [roomName, setRoomName] = useState([]);

	const [messages, setMessages] = useState([]);

	var user = auth.currentUser;
	// const m = user.displayName;

	const man = user.displayName;

	useEffect(() => {
		const unsubscribe = db
			.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setChats(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				);
			});
		// return unsubscribe();
	}, [userchats]);

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			// .collection("userchats")
			.collection("chats")
			.doc(userId)
			.onSnapshot((snapshot) => setRoomName(snapshot.data().display));
	}, [roomName]);

	const CreateChat = () => {
		const chatName = prompt("please enter name for chat");
		setDan(chatName);
		if (chatName) {
			db.collection("users")
				.doc(`${user.phoneNumber}`)
				.collection("/userchats/")
				.doc(`${chatName}`)
				.set({
					// .add({
					id: chatName,
					name: chatName,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				});
		}
	};

	// function echat() {
	// 	{
	// 		chats
	// 			.filter((chat) => {
	// 				if (search == "") {
	// 					return chat;
	// 				} else if (chats.filter(chat).includes("we")) {
	// 					// console.log(chat, "val");
	// 					return chat;
	// 				}
	// 			})
	// 			.map((chat, key) => {
	// 				return <div key={key}>{chat.first_name}</div>;
	// 			});
	// 	}
	// }
	// echat();

	// console.log(search)
	// console.log(
	// 	chats.filter((chat) => {
	// 		const final = chat.data.name.includes(search);
	// 		// console.log(final, chat);
	// 	})
	// );

	// {
	// 	chats.filter((chat) => {
	// 		const fin = chat.data.display.includes(search);
	// 		// SetFinal(chat);
	// 		console.log("fin", fin, chat);
	// 	});
	// }

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) =>
				setMessages(snapshot.docs.map((doc) => doc.data()))
			);
	}, []);

	const time = messages[0]?.timestamp;
	const dateobj = new Date(time * 1000);

	const timestamp = dateobj.toUTCString();

	// console.log(timestamp)

	// console.log(chats.map((chat) => chat.data.display));

	return (
		<div className="sidebar">
			<div className="sidebar__icons">
				<div className="sidebar__svgs">
					{/* <img src={chatIcon1} /> */}
					{/* <Link to="/Contacts" className="sidebar__svgs"> */}
					<img src={chatIcon1} />
					{/* </Link> */}
				</div>
				<div className="sidebar__svg">
					<Link
						to="/Notifications"
						className="sidebar__svg"
						style={{ cursor: "pointer" }}
					>
						<img src={notifi} />
					</Link>
				</div>

				<div className="sidebar__svg">
					{/* <img onClick={CreateChat} src={peoples} /> */}
					<Link to="/Contacts" className="sidebar__svg">
						{/* <img onClick={CreateChat} src={peoples} /> */}
						<img src={contact} />
					</Link>
				</div>
			</div>

			<div className="sidebar__search">
				<Search />
				<input
					type="text"
					placeholder="search"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{/* <div>{final}</div> */}

			<div className="sidebar__name">
				<h3>chats</h3>
				<div className="sidebar__svgname">
					<img src={chatIcon1} />
				</div>
			</div>

			{/* <div className="sidebar__chats">
				{chats.map((chat) => (
					<SidebarChat
						key={chat.id}
						id={chat.id}
						display={chat.data.display}
						name={chat.data.name}
					/>
				))}
			</div> */}

			<div className="sidebar__chats">
				{chats
					.filter((chat) => {
						if (search === "") {
							return chat;
						} else if (chat.data.display.includes(search)) {
							return chat;
						} else if (chat.data.timestamp) {
						}
					})
					.map((chat, key) => (
						<SidebarChat
							key={chat.id}
							id={chat.id}
							display={chat.data.display}
							name={chat.data.name}
							timestamp={chat.data.timestamp}
						/>
					))}
			</div>

			{/* <div>
				{chats
					.filter((chat) => {
						if (search === "") {
							return chat;
						} else if (chat.data.display.includes(search)) {
							return chat;
						}
					})
					.map((chat, key) => (
						<SidebarChat
							key={chat.id}
							id={chat.id}
							display={chat.data.display}
							name={chat.data.name}
						/>
					))}
			</div> */}
		</div>
	);
}

export default Sidebar;
