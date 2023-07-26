// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
	// Select necessary elements
	const body = document.querySelector("body");
	const sidebar = body.querySelector("nav");
	const toggle = body.querySelector(".toggle");
	const searchBtn = body.querySelector(".search-box");
	const modeSwitch = body.querySelector(".toggle-switch");
	const modeText = body.querySelector(".mode-text");
	const hamburger = document.getElementById("hamburger");

	// Toggle sidebar when the toggle button is clicked
	toggle.addEventListener("click", () => {
		sidebar.classList.toggle("close");
	});

	// Remove the "close" class from the sidebar when the search button is clicked
	searchBtn.addEventListener("click", () => {
		sidebar.classList.remove("close");
	});

	// Toggle dark mode when the mode switch is clicked
	modeSwitch.addEventListener("click", () => {
		body.classList.toggle("dark");

		// Update the modeText based on the current mode
		if (body.classList.contains("dark")) {
			modeText.innerText = "Light mode";
		} else {
			modeText.innerText = "Dark mode";
		}
	});

	// Hamburger functionality
	hamburger.addEventListener("click", () => {
		sidebar.classList.toggle("open");
	});
});
