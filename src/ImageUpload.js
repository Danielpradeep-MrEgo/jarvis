import IconButton from "@material-ui/core/IconButton";
import React, { useState, useEffect } from "react";
import "./ImageUpload.css";
import db, { auth, storage } from "./firebase";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import AttachmentIcon from "@material-ui/icons/Attachment";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	input: {
		display: "none",
	},
}));

function ImageUpload() {
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(null);
	const { userId } = useParams();
	const user = auth.currentUser;
	const [mydisplay, setMydisplay] = useState("");
	const classes = useStyles();
	const [hide, setHide] = useState(false);

	var inputElement = "";

	useEffect(() => {
		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.onSnapshot((snapshot) => setMydisplay(snapshot.data().displayName));
	}, []);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	triggerFileUpload = triggerFileUpload.bind(this);

	function triggerFileUpload() {
		inputElement.click();
		setHide(true);
	}

	const Upload = (e) => {
		e.target.value = null;
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

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
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(`${user.phoneNumber}`)
							.collection("userchats")
							.doc(userId)
							.collection("messages")
							.add({
								imageUrl: url,
								name: mydisplay,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});

						{
							storage
								.ref("images")
								.child(image.name)
								.getDownloadURL()
								.then((url) => {
									db.collection("users")
										.doc(`${userId}`)
										.collection("userchats")
										.doc(user.phoneNumber)
										.collection("messages")
										.add({
											imageUrl: url,
											name: mydisplay,
											timestamp: firebase.firestore.FieldValue.serverTimestamp(),
										});
								});
						}
						setProgress(0);
						setHide(false);
						setImage(null);
					});
				setImage(null);
			}
		);
		setImage(null);
	};

	// console.log(image);

	const doublehide = () => {
		setHide(false);
	};

	return (
		<div className="image__upload">
			<Grid>
				<div
					style={{ display: "flex" }}
					className={classes.root}
					style={{
						alignItems: "center",
						left: "0",
					}}
				>
					<input
						className={classes.input}
						type="file"
						ref={(input) => (inputElement = input)}
						onClick={Upload}
						onChange={handleChange}
					/>

					<IconButton color="primary">
						<AttachmentIcon
							style={{ color: "white", zIndex: "1" }}
							onClick={triggerFileUpload}
						/>
					</IconButton>

					<IconButton
						onDoubleClick={doublehide}
						color="primary"
						style={hide === true ? { display: "" } : { display: "none" }}
					>
						<SendIcon
							onClick={handleUpload}
							style={{ color: "white", zIndex: "1" }}
						/>
					</IconButton>

					<div className="image__circle">
						<CircularProgress variant="static" value={progress} />
					</div>
				</div>
			</Grid>
		</div>
	);
}

export default ImageUpload;
