import React, { useCallback, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { useParams } from "react-router-dom";
import "./Chat.css";
import firebase from "firebase";
import db, { auth, oldRealTimeDb } from "./firebase";
import Emoji from "./Emoji";
import { Picker } from "emoji-mart";
import ImageUpload from "./ImageUpload";
import VoiceMess from "./VoiceMess";
import Mic from "@material-ui/icons/Mic";
import Badge from "@material-ui/core/Badge";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getRealtimeUsers } from "./user.actions";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { ExpandMore } from "@material-ui/icons";
import Ironman from "./Ironman.svg";

function Chat() {
	const { userId } = useParams();
	const [input, setInput] = useState([]);
	const { messageId } = useParams();
	const [roomName, setRoomName] = useState([]);
	const [messages, setMessages] = useState([]);
	// const [id, setId] = useState([]);
	// const [{ user }, dispatch] = useStateValue();
	const [useruid, setUseruid] = useState([]);
	const [value, setValue] = useState([]);
	const [online, setOnline] = useState();
	const [dan, setDan] = useState(false);
	const history = useHistory();
	const [contacts, setContacts] = useState([]);
	const [seed, setSeed] = useState();
	const [mydisplay, setMydisplay] = useState(" ");
	const [hover, setHover] = useState(false);
	const [deleteMessage, setDeleteMessage] = useState([]);
	const [sepCon, setSepCon] = useState([]);
	const setRef = useCallback((node) => {
		if (node) {
			node.scrollIntoView({ smooth: true });
		}
	}, []);

	const [del, setDel] = useState([]);
	const user = auth.currentUser;
	const dispatch = getRealtimeUsers([]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setHover(false);
	};

	// const db = firebase.firestore();
	// db.collection("users")
	// 	// .where("uid", "!=", uid)
	// 	.onSnapshot((querySnapshot) => {
	// 		const users = [];
	// 		querySnapshot.forEach(function (doc) {
	// 			if (doc.data().uid != user.uid) {
	// 				users.push(doc.data());
	// 			}
	// 		});
	// 		console.log(users);
	// 	})

	const SpeechRecognition =
		window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new SpeechRecognition();

	recognition.onresult = function (event) {
		const transcript = Array.from(event.results)
			.map((result) => result[0])
			.map((result) => result.transcript)
			.join("");
		// console.log(transcript);
		if (transcript === "send") {
			submitJar();
		} else if (transcript === "back") {
			history.push("/");
		} else if (transcript == "open contacts") {
			history.push("/contacts");
		} else {
			setValue(transcript);
		}
		recognition.onerror = (event) => {
			console.log(event.error);
		};
	};

	const jarvisOn = () => {
		setDan(true);
		// console.log("jarvis", recognition);
	};
	const jarvisOff = () => {
		setDan(false);
	};

	const recOn = () => {
		recognition.start();
	};

	const handleChange = (e) => {
		setInput({ text: e.target.value });
	};

	const addEmoji = (e) => {
		let emoji = e.native;
		setInput({
			text: `${input.text == undefined ? ` ` + emoji : input.text + emoji}`,
		});
	};

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.onSnapshot((snapshot) => setMydisplay(snapshot.data().displayName));
	}, []);

	useEffect(() => {
		if (userId) {
			db.collection("users")
				.doc(user.phoneNumber)
				// .collection("userchats")
				.collection("chats")
				.doc(userId)
				.onSnapshot((snapshot) => setRoomName(snapshot.data().display));

			db.collection("users")
				.doc(userId)
				.collection("profiles")
				.doc(userId)
				.onSnapshot((snapshot) => setSeed(snapshot.data().imageUrl));

			db.collection("users")
				.doc(user.phoneNumber)
				.collection("userchats")
				.doc(userId)
				.collection("messages")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) =>
					setMessages(
						snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
					)
				);

			// const fetchData = async () => {
			// 	const data = await db
			// 		.collection("users")
			// 		.doc(user.phoneNumber)
			// 		.collection("userchats")
			// 		.doc(userId)
			// 		.collection("messages")
			// 		.get();
			// 	setMessages(data.docs.map((doc) => ({ data: doc.data, id: doc.id })));
			// };
			// fetchData();
		}
	}, [userId]);

	// useEffect(() => {
	// 	db.collection("users")
	// 		.doc(`${user.phoneNumber}`)
	// 		.collection("/userchats/")
	// 		// .doc(`${chatName}`)
	// 		.doc(userId)
	// 		.set({
	// 			// .add({
	// 			// id: chatName,
	// 			// name: chatName,
	// 			display: roomName,
	// 			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	// 		});
	// },[]);

	useEffect(() => {
		db.collection("users")
			.doc(userId)
			.get({
				uid: user.phoneNumber,
			})
			// .onSnapshot((snapshot) => setUserid(snapshot.data()))
			.then((docRef) => {
				// console.log("docid", docRef.id);
				setUseruid(docRef.id);
			});
	});

	const submit = (e) => {
		e.preventDefault();

		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.add({
				message: input.text,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then((docRef) => {
				// console.log("doc", docRef.id);
			});

		db.collection("users")
			.doc(userId)
			.collection("userchats")
			.doc(user.phoneNumber)
			.collection("messages")
			.add({
				message: input.text,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.doc(userId)
			.update({
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("/userchats/")
			// .doc(`${chatName}`)
			.doc(userId)
			.set({
				// .add({
				id: userId,
				name: userId,
				display: roomName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		postMessage(setInput());
		setInput({ text: "" });
	};

	const submitJarvis = (e) => {
		e.preventDefault();

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.add({
				message: value,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then((docRef) => {
				// console.log("doc", docRef.id);
			});

		db.collection("users")
			.doc(`${userId}`)
			.collection("userchats")
			.doc(user.phoneNumber)
			.collection("messages")
			.add({
				message: value,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.doc(userId)
			.update({
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("/userchats/")
			// .doc(`${chatName}`)
			.doc(userId)
			.set({
				// .add({
				id: userId,
				name: userId,
				display: roomName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		postMessage(setInput());
		setInput({ text: "" });
		setValue("");
	};
	const submitJar = (e) => {
		// e.preventDefault();

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.add({
				message: value,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then((docRef) => {
				// console.log("doc", docRef.id);
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("userchats")
			.doc(user.phoneNumber)
			.collection("messages")
			.add({
				message: value,
				name: mydisplay,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});

		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("/userchats/")
			// .doc(`${chatName}`)
			.doc(userId)
			.set({
				// .add({
				id: userId,
				name: userId,
				display: roomName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		postMessage(setInput());
		setInput({ text: "" });
		setValue("");
	};

	const read = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// console.log("logout succ");
				// user.remove();
				history.push(`/signOut`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const onDelete = () => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.doc(`${deleteMessage}`)
			.get()
			.then(function (doc) {
				doc.ref.delete();
			});
	};

	const onClearChat = () => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("userchats")
			.doc(userId)
			.collection("messages")
			.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.delete();
				});
				// setAnchorEl(null);
			});
	};

	return (
		<div
			className="chat"
			onMouseLeave={() => {
				// console.log("Event:MouseLeave");
				setHover(false);
			}}
		>
			<div className="chat__header">
				<Avatar src={seed == null ? <Avatar /> : seed} />

				<div className="chat__headerInfo">
					<h3>{roomName}</h3>

					<p>Last message</p>
				</div>
				{/* {user.uid.length > 0
					? userId.users.map((user) => {
							return <span>{user.online ? "online" : "offline"}</span>;
					  })
					: null} */}
				<div>
					<PopupState
						variant="popover"
						popupId="demo-popup-menu"
						color="#101626"
						backgroundColor="#101626"
					>
						{(popupState) => (
							<React.Fragment>
								<Button
									// variant="contained"
									{...bindTrigger(popupState)}
								>
									<MoreVertIcon style={{ color: "white" }} />
								</Button>
								<Menu
									onClick={popupState.close}
									{...bindMenu(popupState)}
									style={{ color: "#101626" }}
									color="#101626"
									PaperProps={{
										style: {
											// backgroundColor: "black",
											backgroundColor: "#101626",
										},
									}}
								>
									<MenuItem
										style={{ backgroundColor: "#101626", color: "#fff" }}
										onClick={onClearChat}
										color="#fff"
									>
										Clear Chat
									</MenuItem>
									{/* <MenuItem
										style={{ backgroundColor: "#101626", color: "#fff" }}
										// onClick={setDan(false)}
										color="#fff"
									>
										Jarvis Mode
									</MenuItem> */}
								</Menu>
							</React.Fragment>
						)}
					</PopupState>
				</div>
			</div>

			<div className="chat__headerRight"></div>

			<div className="chat__body">
				{messages.map((message, index) => (
					<div
						onMouseEnter={() => {
							// console.log("Event:MouseEnter");
							setHover(true);
						}}
						onMouseLeave={() => {
							// console.log("Event:MouseLeave");
							setHover(false);
						}}
						ref={messages ? setRef : null}
						key={index}
						className={`chat__message ${
							message.name === mydisplay && "chat__receive"
						}`}
						// className={`${
						// 	message.name === mydisplay ? "chat__message" : "chat__receive"
						// }`}
					>
						<span className="chat__name" style={{ backgroundColor: "#101626" }}>
							{message.name}
						</span>

						<span
							className={
								hover === true ? "chat__expandmore" : "chat__expandmoreHide"
							}
						>
							<PopupState
								variant="popover"
								popupId="demo-popup-menu"
								color="#101626"
								backgroundColor="#101626"
								style={{ cursor: "pointer" }}
								// onClick={setHover(false)}
							>
								{(popupState) => (
									<React.Fragment>
										<ExpandMore
											style={{ cursor: "pointer" }}
											onMouseEnter={() => {
												// console.log("Event:MouseEnter");
												setHover(true);
											}}
											{...bindTrigger(popupState)}
										/>
										<Menu
											{...bindMenu(popupState)}
											style={{ color: "red" }}
											color="red"
											PaperProps={{
												style: {
													// backgroundColor: "black",
													backgroundColor: "#101626",
												},
											}}
										>
											<MenuItem
												style={{ backgroundColor: "#101626", color: "#fff" }}
												onClick={() => {
													onDelete(setDeleteMessage(message.id));
												}}
												color="#fff"
											>
												Remove
											</MenuItem>
										</Menu>
									</React.Fragment>
								)}
							</PopupState>
						</span>
						<p
							className={`${
								message.name === mydisplay ? "chat__mine" : "chat__others"
							}`}
							style={{
								padding: "0px",
								margin: "0px",
								// backgroundColor: "#101626",
							}}
						>
							{message.message}
						</p>

						<h1
							// style={{ background: "none", backgroundColor: "none" }}
							className={`chat__img ${
								message.imageUrl == null && "chat__image"
							}`}
						>
							<img src={message.imageUrl} />
						</h1>

						<h2 className={`chat__aud ${message.url == null && "chat__audio"}`}>
							<audio controls src={message.url} />
						</h2>

						<span className="chat__timestamp">
							{/* {new Date(message.timestamp?.toDate())
								.toUTCString()
								.split("")
								.slice(0, 17)} */}

							{new Date(message.timestamp?.toDate())
								.toLocaleTimeString()
								.split("")
								.slice(0, 11)}
						</span>
					</div>
				))}
			</div>

			{dan === false ? (
				<div className="chat__footer">
					<div>
						<ImageUpload />
					</div>

					<Emoji>
						<span>
							<Picker onSelect={addEmoji} />
						</span>
					</Emoji>
					<form>
						<input
							type="text"
							placeholder="type here"
							value={input.text}
							onChange={handleChange}
						/>
						<button type="submit" onClick={submit}>
							send
						</button>
					</form>
					<img
						src={Ironman}
						onClick={jarvisOn}
						style={{ color: "white", cursor: "pointer" }}
					/>
					{/* <Mic onClick={jarvisOn} style={{ cursor: "pointer",color:"green" }} /> */}
					<VoiceMess userId={userId} useruid={useruid} />
				</div>
			) : (
				<div className="chat__footer">
					<form onSubmit={submitJarvis}>
						<input
							type="text"
							placeholder="speak to text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</form>
					<Mic onClick={recOn} style={{ color: "white", cursor: "pointer" }} />
					<Button onClick={jarvisOff} style={{ color: "white" }}>
						{/* jarvisOff */}
						<img src={Ironman} style={{ color: "white", cursor: "pointer" }} />
					</Button>
				</div>
			)}
		</div>
	);
}

// export { submitJarvis };
export default Chat;
