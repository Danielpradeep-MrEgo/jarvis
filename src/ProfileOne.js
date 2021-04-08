import Avatar from "@material-ui/core/Avatar";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
// import readOutLoud from "./Welcome";
import firebase from "firebase";
import { Redirect, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import db, { auth, storage } from "./firebase";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { Link } from "react-router-dom";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import { Edit } from "@material-ui/icons";
import Siri from "./Siri.png";

const options = [{}];

const ITEM_HEIGHT = 30;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	color: {
		color: "black",
	},
	large: {
		width: theme.spacing(15),
		height: theme.spacing(15),
		color: "black",
		top: "50px",
	},
}));

function Profile() {
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const [image, setImage] = useState(null);
	const [profs, setProfs] = useState([]);
	const [progress, setProgress] = useState(0);
	const [roomName, setRoomName] = useState([]);
	const { profilesId } = useParams();
	const [name, setName] = useState([]);
	const [hide, setHide] = useState(false);
	const [input, setInput] = useState([]);
	const [about, setAbout] = useState([]);
	const [hover, setHover] = useState(false);
	const [namehide, setNamehide] = useState(false);
	const [display, setDisplay] = useState();
	const [wel, setWel] = useState();
	const [rec, setRec] = useState();
	const user = auth.currentUser;

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	function readLoud() {
		const speech = new SpeechSynthesisUtterance();
		// speech.text = `welcome  to jarvis ${user.displayName}`;
		speech.text = `Logging out; bye`;
		speech.volume = 1;
		speech.rate = 0.5;
		speech.pitch = 1;

		window.speechSynthesis.speak(speech);
	}

	// function readOutLoud() {
	// 	const speech = new SpeechSynthesisUtterance();
	// 	// speech.text = `welcome  to jarvis ${display}`;
	// 	speech.text = `${
	// 		display == null ? "welcome to jarvis" : `welcome to jarvis ${display}`
	// 	}`;
	// 	speech.volume = 1;
	// 	speech.rate = 0.5;
	// 	speech.pitch = 1;

	// 	window.speechSynthesis.speak(speech);
	// }

	const read = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// console.log("logout succ");
				history.push(`/Logout`);
				readLoud();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	var inputElement = "";

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	triggerFileUpload = triggerFileUpload.bind(this);

	function triggerFileUpload() {
		inputElement.click();
	}

	const Upload = (e) => {
		e.target.value = null;
	};

	useEffect(() => {
		if (name) {
			setName("prof.png");
		}
	}, []);



	const handleUpload = () => {
		const uploadTask = storage.ref(`${user.phoneNumber}/${name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				// error function
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
					.ref(`${user.phoneNumber}`)
					.child(`${name}`)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(`${user.phoneNumber}`)
							.collection("profiles")
							.doc(`${user.phoneNumber}`)
							// .collection("messages")
							.set({
								imageUrl: url,
								// name: user.displayName,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});

						setProgress(0);
						setImage(null);
					});
			}
		);
	};

	var id;

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc(user.phoneNumber)
			.onSnapshot((snapshot) => setRoomName(snapshot.data().imageUrl));
	}, [image]);

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc(`about`)
			.onSnapshot((snapshot) => setAbout(snapshot.data().about));
	}, [about]);

	useEffect(() => {
		// if (displayName) {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.onSnapshot((snapshot) => setDisplay(snapshot.data().displayName));
		// }
	}, [display]);

	const inputHide = () => {
		setHide(true);
	};

	const submitName = (e) => {
		e.preventDefault();
		setHide(false);
		db.collection("users")
			.doc(`${user.phoneNumber}`)
			.collection("profiles")
			.doc(`about`)
			// .collection("messages")
			.set({
				about: input,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		setInput("");
	};

	const nameHide = () => {
		setNamehide(true);
	};

	// useEffect(() => {
	// 	setWel(display);
	// });

	// useEffect(() => {
	// 	if (display != undefined) {
	// 		readOutLoud(display);
	// 	}
	// }, [display]);

	/////////////////////////////////////////////////////////////////

	const SpeechRecognition =
		window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new SpeechRecognition();
	// var recognition = mySpeechRecognition.continuous;
	recognition.continuous = rec;

	recognition.onresult = function (event) {
		var transcript = Array.from(event.results)
			.map((result) => result[0])
			.map((result) => result.transcript)
			.join("");
		// console.log(transcript);

		if (transcript == "profile") {
			triggerFileUpload();
			handleChange();
			// Upload();
		}
		// if (transcript.includes("profile")) {
		// 	triggerFileUpload();
		// }
		if (transcript.includes("upload")) {
			handleUpload();
		}
		if (transcript === "upload") {
			handleUpload();
		}
		if (transcript.includes("stop")) {
			recognition.stop();
		}
	};

	/////////////////////////////////////////////////////////////////
	const jarvisOn = () => {
		recognition.start();
	};

	// console.log(display);
	return (
		<div className="profile">
			<Grid container direction="row" justify="center" color="black">
				<div
					onMouseEnter={() => {
						console.log("Event:MouseEnter");
						setHover(true);
					}}
					onMouseLeave={() => {
						console.log("Event:MouseLeave");
						setHover(false);
						// handleUpload()
					}}
					className={!hover == true ? "editHide" : "edit"}
					// onClick={triggerFileUpload}
				>
					<EditIcon style={{ cursor: "pointer" }} onClick={triggerFileUpload} />
					<Button
						style={{
							backgroundColor: "transparent",
							textTransform: "inherit",
							fontFamily: "inherit",
							fontStyle: "inherit",
							cursor: "pointer",
							outline: "none",
							color: "white",
						}}
						onClick={handleUpload}
					>
						update
					</Button>
				</div>
				<div className="profile__avatar">
					<Avatar
						onMouseEnter={() => {
							console.log("Event:MouseEnter");
							setHover(true);
						}}
						onMouseLeave={() => {
							console.log("Event:MouseLeave");
							setHover(false);
						}}
						// src="https://instagram.fvtz3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/119168344_174846940897212_4969381232378746182_n.jpg?_nc_ht=instagram.fvtz3-1.fna.fbcdn.net&_nc_ohc=Xp3FicVsblwAX86Ym1s&tp=1&oh=e92421670b5795add388d3d90c5bc604&oe=6006ABE6"
						src={roomName}
						className={classes.large}
					/>
					{/* ))} */}
				</div>
			</Grid>

			{/* <div className="edit">
				<EditIcon />
			</div> */}

			<div className="profile__name">
				<Link to="/AddDisplay">
					<div className="profile__name">
						{display == null ? (
							// <EditIcon />
							<h6>
								<Edit />
							</h6>
						) : (
							// onClick={inputHide}

							<h6>{display}</h6>
						)}
					</div>
				</Link>
			</div>

			<div className="profile__about">
				<h4>
					ABOUT
					{/* <IconButton> */}
					<EditIcon
						style={{ height: "12px", color: "white", cursor: "pointer" }}
						onClick={inputHide}
					/>
					{/* </IconButton> */}
				</h4>
				<div className="profile__flex">
					<input
						style={{ flex: "1" }}
						type="text"
						onChange={(e) => setInput(e.target.value)}
						className={`${
							!hide == true ? "profile__input" : "profile__inputh"
						}`}
					/>
					<div
						className={`${
							!hide == true ? "profile__input" : "profile__inputhide"
						}`}
					>
						<Button
							style={{
								// width: "50px",
								// color: "",
								backgroundColor: "transparent",
								textTransform: "inherit",
								fontFamily: "inherit",
								fontStyle: "inherit",
								cursor: "pointer",
								outline: "none",
							}}
							type="submit"
							onClick={submitName}
							className={`${
								!hide == true ? "profile__input" : "profile__inputhide"
							}`}
						>
							{/* <EditIcon style={{color:"#101626"}} /> */}
							{/* <ThumbUpIcon style={{color:"#101626"}} /> */}
							Done
						</Button>
					</div>
				</div>
				<div className="about">{about}</div>
				{/* <Button onClick={jarvisOn} style={{ color: "white" }}>
					jarvis
				</Button> */}
			</div>
			{/* <button onClick={read}>signOut</button> */}
			{/* <div className="siriimg">
				<img src={Siri} />
			</div> */}

			<div style={{ backgroundColor: "black" }}>
				<IconButton
					style={{
						display: "flex",
						flexDirection: "column",
						position: "absolute",
						color: "white",
						bottom: "0",
						fontStyle: "inherit",
						fontFamily: "inherit",
						fontSize: "x-small",
						textTransform: "lowerCase",
					}}
					aria-label="more"
					aria-controls="long-menu"
					aria-haspopup="true"
					onClick={handleClick}
				>
					{/* <MoreVertIcon /> */}
				</IconButton>
				<Menu
					style={{
						borderRadius: "30px",
						borderRightColor: "black",
						borderRight: "2px solid black",
					}}
					id="long-menu"
					anchorEl={anchorEl}
					keepMounted
					open={open}
					onClose={handleClose}
					PaperProps={{
						style: {
							maxHeight: ITEM_HEIGHT * 4,
							width: "20ch",
							backgroundColor: "#101626",
						},
					}}
				>
					<div
						style={{
							display: "none",
							alignItems: "center",
							// justifyContent: "space-evenly",
						}}
					>
						<Button
							onClick={triggerFileUpload}
							style={{
								color: "white",
								backgroundColor: "transparent",
								// border: "none",
								textTransform: "inherit",
								fontFamily: "inherit",
								fontStyle: "inherit",
								// width: "100%",
								// height: "10px",
								cursor: "pointer",
								// borderRadius: "30px",
								outline: "none",
							}}
						>
							Profile
							<input
								type="file"
								ref={(input) => (inputElement = input)}
								onClick={Upload}
								onChange={handleChange}
								style={{
									display: "flex",
									outline: "none",
									border: "none",
									color: "#101626",
									cursor: "pointer",
									opacity: "0",
									zIndex: "-1",
								}}
							/>
						</Button>

						<Button>
							<EditIcon
								style={{
									color: "white",
									height: "xx-small",
									cursor: "pointer",
								}}
								onClick={handleUpload}
							/>
						</Button>
					</div>
				</Menu>
			</div>
			<PowerSettingsNewOutlinedIcon
				onClick={read}
				style={{
					display: "flex",
					flexDirection: "column",
					position: "absolute",
					color: "white",
					bottom: "15px",
					fontStyle: "inherit",
					fontFamily: "inherit",
					// fontSize: "x-small",
					textTransform: "lowerCase",
					alignItems: "center",
					justifyContent: "center",
					translateX: "-50",
					transformY: "-50",
					cursor: "pointer",
				}}
			>
				<Button onClick={read} style={{ color: "white" }}>
					Logout
				</Button>
			</PowerSettingsNewOutlinedIcon>
		</div>
	);
}

export default Profile;
