import React, { useState } from "react";
import "./NotificationMain.css";
import chatIcon1 from "./chatIcon1.svg";
import notifi from "./notifi.svg";
import peoples from "./peoples.svg";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";

function NotificationMain() {

	const [search, setSearch] = useState("");
	return (
		<div className="notificationMain">
			<div className="notificationMain__icons">
				<div className="notificationMain__svgs">
					<Link to="/" className="notificationMain__svgs">
						<img src={chatIcon1} />
					</Link>
				</div>
				<div className="notificationMain__svg">
					<Link to="/Notifications" className="notificationMain__svg">
						<img src={notifi} />
					</Link>
				</div>
				<Link to="/AddContacts">
					<div className="notificationMain__svg">
						<img src={peoples} />
					</div>
				</Link>
			</div>

			<div className="notificationMain__search">
				<Search />
				<input
					type="text"
					placeholder="search"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className="notificationMain__name">
				<h3>Notifications</h3>
				<div className="notificationMain__svgname">
					<img src={notifi} />
				</div>
			</div>
		</div>
	);
}

export default NotificationMain;
