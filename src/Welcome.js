// import id from "./id"
import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
const user = auth.currentUser;

const button = document.queryCommandEnabled(".talk");

const SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function readOutLoud(name) {
	const speech = new SpeechSynthesisUtterance();
	// speech.text = `welcome  to jarvis ${user.displayName}`;
	speech.text = `Hello${name} welcome to jarvis`;
	speech.volume = 1;
	speech.rate = 0.5;
	speech.pitch = 1;

	window.speechSynthesis.speak(speech);
}

function sys() {
	const speech = new SpeechSynthesisUtterance();
	speech.text = "systems turning on";
	// speech.text = `welcome  to jarvis ${id}`;
	speech.volume = 1;
	speech.rate = 0.5;
	speech.pitch = 1;

	window.speechSynthesis.speak(speech);
}
function err() {
	const speech = new SpeechSynthesisUtterance();
	speech.text = "systems turning off";
	// speech.text = `welcome  to jarvis ${id}`;
	speech.volume = 1;
	speech.rate = 0.5;
	speech.pitch = 1;

	window.speechSynthesis.speak(speech);
}

export { sys, err };
export default readOutLoud;
