import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "./firebase";
import db, { auth, storage } from "./firebase";
import "./AddDisplay.css";
import { useHistory } from "react-router-dom";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";

function AddDisplay() {
	const [display, setDisplay] = useState("");
	const history = useHistory();
	const [rec, setRec] = useState(true);

	const user = auth.currentUser;
	const submit = (e) => {
		e.preventDefault();

		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.set({
				displayName: display,
			});
		setDisplay("");
	};

	const back = (e) => {
		e.preventDefault();
		history.push("/Contacts");
	};

	// console.log(user.phoneNumber);

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
		console.log(transcript);

		// setDisplay(transcript);

		if (transcript.includes("set name")) {
			var sli = transcript.slice().split(" ");
			console.log(sli);
			let match = sli.findIndex(
				(item) => item.toLocaleLowerCase().indexOf("name") > -1
			);
			// console.log(match);

			let ma = sli.findIndex(
				(item) => item.toLocaleLowerCase().indexOf("set") > -1
			);
			// console.log(ma, "Ma");

			let add = sli.slice(match + 1, ma - 1);
			console.log(add);
			setDisplay(add);
		}
		if (transcript.includes("set name")) {
			var sli = transcript.slice().split(" ");
			// console.log(sli);
			let match = sli.findIndex(
				(item) => item.toLocaleLowerCase().indexOf("name") > -1
			);
			// console.log(match);

			let ma = sli.findIndex(
				(item) => item.toLocaleLowerCase().indexOf("set") > -1
			);
			// console.log(ma, "Ma");

			let add = sli.slice(match + 1, ma - 1);
			// console.log(add);
			var st = add.toString();
			// var cut = sli.findIndex(
			// 	(item) => item.toLocaleLowerCase().indexOf(",") > -1
			// );
			// console.log("st", cut);
			setDisplay(st);
		}
		if (transcript == "update") {
			submitName();
		}
		if (transcript.includes("update")) {
			submitName();
		}
		if (transcript.includes("clear")) {
			setDisplay("");
		}
		if (transcript === "clear") {
			setDisplay("");
		}
		if (transcript.includes("stop")) {
			recognition.stop();
		}
	};

	/////////////////////////////////////////////////////////////////

	const submitName = () => {
		// e.preventDefault();

		db.collection("users")
			.doc(user.phoneNumber)
			.collection("profiles")
			.doc("displayName")
			.set({
				displayName: display,
			});
		setDisplay("");
	};

	const jarvisOn = () => {
		recognition.start();
	};

	return (
		<div className="addDisplay__main">
			<div className="addDisplay__ani">
				<div>
					<h1>Jarvis</h1>
				</div>
				<div className="addDisplay">
					<div className="addDisplay__form">
						<form>
							<h1>Jarvis</h1>

							<input
								placeholder="Enter Your Name"
								value={display}
								onChange={(e) => setDisplay(e.target.value)}
							/>
							<div className="button__sub">
								<Button type="submit" onClick={submit}>
									Add
								</Button>
							</div>
							<div className="button">
								<ArrowLeftIcon />
								<Button type="submit" onClick={back}>
									Back
								</Button>
								<div className="button_jarvis">
									<Button onClick={jarvisOn} style={{ color: "white" }}>
										jarvis
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddDisplay;
