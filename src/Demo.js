import React from "react";
import Login from "./Login";
import Particles from "react-particles-js";
import "./Demo.css";
import LoginBack from "./LoginBack";

function Demo() {
	return (
		<div
			className="demo"
			style={{
				height: "100vh",
				backgroundImage:
					"url(https://cdn.pixabay.com/photo/2016/12/29/18/44/background-1939128_1280.jpg/)",
			}}
		>
			<div className="demo__h1">
				<h1 style={{ color: "white" }}>Jarvis</h1>
				<p>Sign in or create an account</p>
			</div>
			<Particles
				params={{
					particles: {
						number: {
							value: 80,
							density: {
								enable: true,
								value_area: 800,
							},
						},
						color: {
							value: "#ffffff",
						},
						shape: {
							type: "circle",
							stroke: {
								width: 0,
								color: "#000000",
							},
							polygon: {
								nb_sides: 5,
							},
							image: {
								src: "img/github.svg",
								width: 100,
								height: 100,
							},
						},
						opacity: {
							value: 0.5,
							random: false,
							anim: {
								enable: false,
								speed: 1,
								opacity_min: 0.1,
								sync: false,
							},
						},
						size: {
							value: 5,
							random: true,
							anim: {
								enable: false,
								speed: 40,
								size_min: 0.1,
								sync: false,
							},
						},
						line_linked: {
							enable: true,
							distance: 150,
							color: "#ffffff",
							opacity: 0.4,
							width: 1,
						},
						move: {
							enable: true,
							speed: 6,
							direction: "none",
							random: false,
							straight: false,
							out_mode: "out",
							attract: {
								enable: false,
								rotateX: 600,
								rotateY: 1200,
							},
						},
					},
					interactivity: {
						detect_on: "canvas",
						events: {
							onhover: {
								enable: false,
								mode: "repulse",
							},
							onclick: {
								enable: true,
								mode: "push",
							},
							resize: true,
						},
						modes: {
							grab: {
								distance: 400,
								line_linked: {
									opacity: 1,
								},
							},
							bubble: {
								distance: 400,
								size: 40,
								duration: 2,
								opacity: 8,
								speed: 3,
							},
							repulse: {
								distance: 200,
							},
							push: {
								particles_nb: 4,
							},
							remove: {
								particles_nb: 2,
							},
						},
					},
				}}
			/>

			<LoginBack />
		</div>
	);
}

export default Demo;
