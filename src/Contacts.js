import React, { useState, useEffect } from "react";
import "./Contacts.css";
import chatIcon1 from "./chatIcon1.svg";
import notifi from "./notifi.svg";
import peoples from "./peoples.svg";
import firebase from "firebase";
import { auth } from "./firebase";
import readOutLoud from "./Welcome";
import contact from "./contact.svg";
import { Link, useParams } from "react-router-dom";
import Search from "@material-ui/icons/Search";
import SideContacts from "./SideContacts";
import db from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import purple from "@material-ui/core/colors/purple";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		minWidth: "auto",
		backgroundColor: "#101626",
	},
}));

function Contacts() {
	const [dan, setDan] = useState("");
	const user = auth.currentUser;
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState([]);
	const [chatName, setChatName] = useState();
	const [name, setName] = useState([]);
	const [clo, setClo] = useState({ color: "black" });
	const [conts, setConts] = useState([]);
	const [search, setSearch] = useState("");
	const { userId } = useParams();

	const handleOpen = () => {
		setOpen(true);
	};

	const handle = (e) => {
		e.preventDefault();
		setChatName(input);
		setClo({ color: "green" });
	};

	const handleClose = (e) => {
		e.preventDefault();
		CreateChat();
		// setInput("");
		// setName("");
		done();
	};

	const done = () => {
		CreateChat();
		CreateChat();
		setInput("");
		setName("");
		setOpen(false);
	};

	const CreateChat = () => {
		// const chatName = prompt("please enter name for chat");
		// setDan(chatName);
		// setInput(chatName);
		if (chatName) {
			db.collection("users")
				.doc(`${user.phoneNumber}`)
				.collection("/userchats/")
				.doc(`${chatName}`)
				.set({
					// .add({
					id: chatName,
					name: chatName,
					display: name,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				});
			// setOpen(false);
		}
		// db.collection("users")
		// 	.doc(`${chatName}`)
		// 	.collection("profiles")
		// 	.doc(`${chatName}`)
		// 	.set({
		// 		imageUrl: "",
		// 		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		// 	});
	};

	useEffect(() => {
		const unsubscribe = db
			.collection("users")
			.doc(`${user.phoneNumber}`)
			// .collection("userchats")
			.collection("chats")
			.onSnapshot((snapshot) => {
				setConts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				);
			});
	}, []);

	return (
		<div className="contacts">
			<div className="contacts__icons">
				<div className="contacts__svg">
					<Link to="/"  className="contacts__svgs">
						<img src={chatIcon1} />
						{/* <img src={contact} /> */}
					</Link>
				</div>
				<div className="contacts__svg">
					<Link to="/Notifications" className="contacts__svg">
						<img src={notifi} />
					</Link>
				</div>
				<Link to="/AddContacts">
					<div className="contacts__svgs">
						<img onClick={handleOpen} src={peoples} />

						{/* <img onClick={CreateChat} src={peoples} /> */}
						{/* <img onClick={handleOpen} src={peoples} />
					<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={open}
					onClose={handleClose}
					closeAfterTransition
					BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500,
						}}
						>
						<Fade in={open}>
						<div
						className={classes.paper}
						style={{ display: "flex", flexDirection: "column" }}
						>
						<h4 style={{ color: "#ffffff" }} id="transition-modal-title">
						Add contact
						</h4>
						<p id="transition-modal-description">
						<form
						onSubmit={handle}
						style={{ padding: "10px", borderRadius: "30px" }}
						>
						<input
						style={{
							margin: "10px",
						}}
						type="text"
						value={input}
						placeholder="Enter Phone"
						onChange={(e) => setInput(e.target.value)}
						/>
						<Button
						type="submit"
						onClick={handle}
						style={{ border: "30px", color: "white" }}
						>
						ok
						</Button>
						<CheckCircleOutlineIcon style={clo} />
						<form onSubmit={handle}>
						<input
						style={{
							margin: "10px",
						}}
						type="text"
						value={name}
						placeholder="Enter Name"
						onChange={(e) => setName(e.target.value)}
						/>
						<Button
						type="submit"
						onClick={handleClose}
						style={{ border: "30px", color: "white" }}
						>
						Add
						</Button>
						</form>
						</form>
						</p>
						</div>
						</Fade>
					</Modal> */}
						{/* </img> */}
					</div>
				</Link>
			</div>

			<div className="contacts__search">
				<Search />
				<input
					type="text"
					placeholder="search"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className="contacts__name">
				<h3>Contacts</h3>
				<div className="contacts__svgname">
					<img src={contact} />
				</div>
			</div>

			<div className="contacts__chats">
				{/* {conts.map((cont) => (
					<SideContacts
						key={cont.id}
						id={cont.id}
						display={cont.data.display}
						name={cont.data.name}
					/>
				))} */}
				{conts
					.filter((cont) => {
						if (search == "") {
							return cont;
						} else if (cont.data.display.includes(search)) {
							return cont;
						}
					})
					.map((cont, key) => (
						<SideContacts
							key={cont.id}
							id={cont.id}
							display={cont.data.display}
							name={cont.data.name}
						/>
					))}
			</div>
		</div>
	);
}

export default Contacts;
