import React, { useEffect, useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import db, { auth, storage } from "./firebase";
import firebase from "firebase";
import "./VoiceMess.css";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { Mic } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
	root: {
		width: 500,
	},
	typography: {
		padding: theme.spacing(2),
	},
}));

function VoiceMess({ userId }) {
	const [progress, setProgress] = useState(0);
	const [name, setName] = useState("");
	const user = auth.currentUser;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const [placement, setPlacement] = React.useState();
	const classes = useStyles();
	const [mydisplay, setMydisplay] = useState("");

	const handleClick = (newPlacement) => (event) => {
		setAnchorEl(event.currentTarget);
		setOpen((prev) => placement !== newPlacement || !prev);
		setPlacement(newPlacement);
	};

	useEffect(() => {
		// if (name) {
		setName(Math.floor(Math.random() * 500000));
		// }
	}, []);

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.onSnapshot((snapshot) => setMydisplay(snapshot.data().displayName));
	}, []);

	const recorder = new MicRecorder({
		bitRate: 128,
	});

	const button = document.querySelector(".button");
	const startRecording = () => {
		recorder
			.start()
			.then(() => {})
			.catch((e) => {
				console.error(e);
			});
	};

	const stopRecording = () => {
		recorder
			.stop()
			.getMp3()
			.then(([buffer, blob]) => {
				console.log(buffer, blob);
				const file = new File(buffer, `${name}`, {
					type: blob.type,
					lastModified: Date.now(),
				});

				const span = document.createElement("span");
				console.log(span, "span");
				const player = new Audio(URL.createObjectURL(file));
				console.log("player", player);
				player.controls = true;
				span.appendChild(player);
				document.querySelector("#playlist").appendChild(span);

				submitAudio(file);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	function submitAudio(file) {
		const uploadTask = storage.ref(`audios/${file.name}`).put(file);

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
					.ref("audios")
					.child(file.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(`${user.phoneNumber}`)
							.collection("userchats")
							.doc(userId)
							.collection("messages")
							.add({
								url: url,
								name: mydisplay,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});
						{
							storage
								.ref("audios")
								.child(file.name)
								.getDownloadURL()
								.then((url) => {
									db.collection("users")
										.doc(`${userId}`)
										.collection("userchats")
										.doc(user.phoneNumber)
										.collection("messages")
										.add({
											url: url,
											name: mydisplay,
											timestamp: firebase.firestore.FieldValue.serverTimestamp(),
										});
								});
						}
						setProgress(0);
					});
			}
		);
	}

	const style = {
		color: "white",
	};

	const styles = {
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		color: "white",
	};

	return (
		<div className="voicemess">
			<div
				className={classes.root}
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Popper
					open={open}
					anchorEl={anchorEl}
					placement={placement}
					transition
				>
					{({ TransitionProps }) => (
						<Fade {...TransitionProps} timeout={350}>
							<Paper>
								<Typography
									className={classes.typography}
									style={{
										displayName: "flex",
										alignItems: "center",
										justifyItems: "center",
										color: "white",
										backgroundColor: "#101626",
										borderLeft: "1px solid #101626",
										borderLeftColor: "#101626",
										borderRight: "1px solid #101626",
										borderRightColor: "#101626",
									}}
								>
									<IconButton style={styles}>
										<button
											onClick={startRecording}
											style={{
												backgroundColor: "#101626",
												border: "none",
												borderRadius: "10px",
												outline: "none",
												color: "white",
												cursor: "pointer",
											}}
										>
											<PlayArrowIcon />
										</button>
									</IconButton>
									<IconButton style={styles}>
										<button
											onClick={stopRecording}
											style={{
												backgroundColor: "#101626",
												border: "none",
												borderRadius: "10px",
												outline: "none",
												color: "white",
												cursor: "pointer",
											}}
										>
											<StopIcon />
										</button>
									</IconButton>
								</Typography>
							</Paper>
						</Fade>
					)}
				</Popper>
				<Grid
					style={{
						color: "white",
						width: "40px",
						paddingBottom: "10px",
					}}
				>
					<Grid item>
						<IconButton
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "50%",
							}}
						>
							<Mic
								style={{
									paddingTop: "10px",
									color: "white",
									zIndex: "1",
								}}
								onClick={handleClick("top-end")}
							/>
							<div className="voice__circle">
								<CircularProgress variant="static" value={progress} />
							</div>
						</IconButton>
					</Grid>
				</Grid>
			</div>
			<span id="playlist"></span>
		</div>
	);
}

export default VoiceMess;
