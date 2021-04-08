const button = document.queryCommandEnabled(".talk");
var content = document.querySelector("current-0");

const welcome = ["hello my sir daniel"];
const God = ["My God is Daniel"];

const SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
	// console.log("voice is activated");
};

recognition.onresult = function (event) {
	const current = event.resultIndex;
	const transcript = event.results[current][0].transcript;
	readOutLoud(transcript);
};

function readOutLoud(message) {
	const speech = new SpeechSynthesisUtterance();
	// console.log(speech);
	// console.log(message);

	// speech.text = "hello my sir"

	if (message.includes("hello Jarvis")) {
		const finalText = welcome[Math.floor(Math.random() * welcome.length)];
		speech.text = finalText;
	}

	if (message.includes("hello Jarvis who is your God")) {
		const finalText = God[Math.floor(Math.random() * God.length)];
		speech.text = finalText;
	}

	// speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;

	window.speechSynthesis.speak(speech);

	return (
		<div>
			<button type="button">talk</button>
		</div>
	);
}

export { button, recognition };
export default readOutLoud;
