import React, { Component } from "react";
import "./Emoji.css";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { Mic } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import VoiceMess from "./VoiceMess";

export default class Emoji extends Component {
	state = {
		on: false,
	};

	toogle = () => {
		this.setState({
			on: !this.state.on,
		});
	};

	render() {
		return (
			<div className="emoji__icon">
				{this.state.on && this.props.children}
				{/* {this.state.on && <Picker onEmojiClick={onEmojiClick}/>} */}
				<IconButton>
					<EmojiEmotionsIcon onClick={this.toogle} />
				</IconButton>
				{/* <VoiceMess /> */}
				{/* <Mic onClick = {this.toogle}/> */}
			</div>
		);
	}
}
