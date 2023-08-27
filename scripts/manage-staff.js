document.addEventListener("DOMContentLoaded", async function () {
	// Get necessary subject elements
	const subjectsSelect = document.getElementById("subjectSelectField");
	const subjectSearchInput = document.getElementById("subjectSearchInput");
	const selectedSubjectsList = document.getElementById("selectedSubjectsList");

	// Get necessary position elements
	const positionsSelect = document.getElementById("positionSelectField");
	const positionSearchInput = document.getElementById("positionSearchInput");
	const selectedPositionsList = document.getElementById(
		"selectedPositionsList"
	);

	try {
		// Fetch staff data
		const response = await fetch("mockData/staff.json");
		const data = await response.json();

		const staffListContainer = document.querySelector(".staff-list");

		data.staff.forEach((staff) => {
			const fullName = `${staff.first_name} ${staff.last_name}`;
			const staffListItem = document.createElement("div");
			staffListItem.className = "staff-list-item";
			staffListItem.textContent = fullName;
			staffListItem.dataset.staffId = staff.id;
			staffListContainer.appendChild(staffListItem);
		});

		staffListContainer.addEventListener("click", function (event) {
			const clickedStaffId = event.target.dataset.staffId;

			if (clickedStaffId) {
				window.location.href = `view-staff.html?staffId=${clickedStaffId}`;
			}
		});

		const searchInput = document.querySelector(".search-staff");
		const errorMessage = document.querySelector(".error-message");

		searchInput.addEventListener("input", function () {
			const searchTerm = searchInput.value.toLowerCase();
			const staffItems = document.querySelectorAll(".staff-list-item");
			let found = false;

			staffItems.forEach((item) => {
				const staffName = item.textContent.toLowerCase();
				item.style.display =
					staffName.indexOf(searchTerm) !== -1 ? "block" : "none";
				if (item.style.display === "block") {
					found = true;
				}
			});

			errorMessage.style.display = found ? "none" : "block";
		});
	} catch (error) {
		console.error("Error fetching staff data:", error);
	}

	// Fetch subjects and positions data
	try {
		const [subjectsResponse, positionsResponse] = await Promise.all([
			fetch("mockData/subjects.json"),
			fetch("mockData/positions.json"),
		]);

		const subjectsData = await subjectsResponse.json();
		const positionsData = await positionsResponse.json();

		// Function to populate select options
		function populateSelectOptions(
			data,
			selectElement,
			onChangeCallback,
			listElement
		) {
			// Clear any existing options
			selectElement.innerHTML = "";

			// Add a placeholder option for default selection
			const placeholderOption = document.createElement("option");
			placeholderOption.value = "";
			placeholderOption.text = "Select an option";
			placeholderOption.disabled = true;
			placeholderOption.selected = true;
			selectElement.appendChild(placeholderOption);

			// Add data options
			data.forEach((item) => {
				const option = document.createElement("option");
				option.value = item.name || item;
				option.text = item.name || item;
				selectElement.appendChild(option);
			});

			selectElement.addEventListener("change", function () {
				const selectedOption =
					selectElement.options[selectElement.selectedIndex];
				if (selectedOption.value !== "") {
					onChangeCallback(selectedOption, listElement);
				}
			});
		}

		// Function to add selected item to the list
		function addSelectedItem(selectedOption, listElement) {
			const listItem = document.createElement("li");
			listItem.textContent = selectedOption.textContent;

			const minusIcon = document.createElement("span");
			minusIcon.classList.add("minus-icon");
			listItem.appendChild(minusIcon);
			minusIcon.textContent = " - remove ";
			listElement.appendChild(listItem);
		}

		// Function to remove a selected item
		function removeSelectedItem(selectedItem, selectElement, listElement) {
			const itemName = selectedItem.textContent;
			const optionToRemove = Array.from(selectElement.options).find(
				(option) => option.textContent === itemName
			);

			if (optionToRemove) {
				optionToRemove.disabled = false;
			}

			listElement.removeChild(selectedItem);
		}

		// Event listener for removing items from the list
		function setupRemoveListener(listElement, selectElement) {
			listElement.addEventListener("click", function (event) {
				if (event.target.classList.contains("minus-icon")) {
					const listItem = event.target.parentElement;
					removeSelectedItem(listItem, selectElement, listElement);
				}
			});
		}

		// Reset input and hide options after selecting an item
		function resetInput(selectElement, searchInput) {
			searchInput.value = "";
			selectElement.value = "";
			selectElement.options[0].selected = true;
			selectElement.options[0].disabled = false;
			selectElement.parentElement.classList.remove("active");
			selectElement.parentElement.classList.remove("options-visible");
		}

		const allSubjects = [
			...subjectsData.subjects["first cycle"],
			...subjectsData.subjects["second cycle"],
		];

		// Add a placeholder option for default selection
		function addPlaceholderOption(selectElement) {
			const placeholderOption = document.createElement("option");
			placeholderOption.value = "";
			placeholderOption.text = "Select an option";
			placeholderOption.disabled = true;
			placeholderOption.selected = true;
			selectElement.appendChild(placeholderOption);
		}

		// Populate initial subjects and positions
		addPlaceholderOption(subjectsSelect);
		populateSelectOptions(
			allSubjects,
			subjectsSelect,
			addSelectedSubject,
			selectedSubjectsList
		);
		addPlaceholderOption(positionsSelect);
		populateSelectOptions(
			positionsData.position.staff,
			positionsSelect,
			addSelectedPosition, // Updated function name
			selectedPositionsList
		);

		// Function to handle subject selection
		function addSelectedSubject(selectedOption, listElement) {
			addSelectedItem(selectedOption, listElement);
			selectedOption.disabled = true;
			resetInput(subjectsSelect, subjectSearchInput);
		}

		// Function to handle position selection
		function addSelectedPosition(selectedOption, listElement) {
			addSelectedItem(selectedOption, listElement);
			selectedOption.disabled = true;
			resetInput(positionsSelect, positionSearchInput);
		}

		// Setup search listener for subjects
		setupSearchListener(
			subjectSearchInput,
			subjectsSelect,
			allSubjects,
			addSelectedSubject,
			selectedSubjectsList
		);

		// Setup search listener for positions
		setupSearchListenerForPositions(
			positionSearchInput,
			positionsSelect,
			positionsData.position.staff,
			addSelectedPosition,
			selectedPositionsList
		);

		// Set up listeners for subjects and positions
		setupRemoveListener(selectedSubjectsList, subjectsSelect);
		setupRemoveListener(selectedPositionsList, positionsSelect);

		// Function to handle search for subjects
		function setupSearchListener(
			searchInput,
			selectElement,
			dataList,
			onChangeCallback,
			listElement
		) {
			setupSearchInputFocusBlur(selectElement, dataList);

			searchInput.addEventListener("input", function () {
				const searchValue = this.value.toLowerCase();
				selectElement.innerHTML = "";

				const filteredItems = dataList.filter((item) =>
					item.name.toLowerCase().includes(searchValue)
				);

				if (filteredItems.length === 0) {
					const option = document.createElement("option");
					option.value = "not-found";
					option.text =
						"Sorry, the item you entered doesn't exist in the database.";
					selectElement.appendChild(option);
				} else {
					populateSelectOptions(
						filteredItems,
						selectElement,
						onChangeCallback,
						listElement
					);
				}

				selectElement.size = filteredItems.length + 1;
			});
		}

		// Function to handle search for positions
		function setupSearchListenerForPositions(
			searchInput,
			selectElement,
			dataList,
			onChangeCallback,
			listElement
		) {
			setupSearchInputFocusBlur(selectElement, dataList);

			searchInput.addEventListener("input", function () {
				const searchValue = this.value.toLowerCase();
				selectElement.innerHTML = "";

				const filteredItems = dataList.filter((item) =>
					item.toLowerCase().includes(searchValue)
				);

				if (filteredItems.length === 0) {
					const option = document.createElement("option");
					option.value = "not-found";
					option.text =
						"Sorry, the item you entered doesn't exist in the database.";
					selectElement.appendChild(option);
				} else {
					populateSelectOptions(
						filteredItems,
						selectElement,
						onChangeCallback,
						listElement
					);
				}

				selectElement.size = filteredItems.length + 1;
			});
		}
	} catch (error) {
		console.error("Error fetching subjects or positions data:", error);
	}

	// Function to set up focus and blur events for search inputs
	function setupSearchInputFocusBlur(selectElement, dataList) {
		selectElement.addEventListener("focus", function () {
			selectElement.size = dataList.length + 1;
			// Deselect any selected option
			selectElement.selectedIndex = -2;
		});

		selectElement.addEventListener("blur", function () {
			selectElement.size = 1;
		});
	}

	//submit form - adding newly created staff account to the saff.json
	//You will have to edit the code to fetch using the right endpoint
	//Also push to the right using the right data structure or query data from the json newly created json object.
	//let me know if you have any questions or doubts
	document
		.getElementById("create-account")
		.addEventListener("click", async function () {
			const title = document.getElementById("selectGender").value;
			const firstName = document.getElementById("newFirstName").value;
			const lastName = document.getElementById("newLastName").value;
			const gender = title === "male" ? "Mr" : "Ms";
			const phoneNumber = document.getElementById("newPhoneNumber").value;
			const accessLevel = document.getElementById("selectAccessLevel").value;

			// Generate 8-digit random ID
			const id = Math.floor(10000000 + Math.random() * 90000000);

			const today = new Date();
			const dd = String(today.getDate()).padStart(2, "0");
			const mm = String(today.getMonth() + 1).padStart(2, "0");
			const yyyy = today.getFullYear();
			const accountCreatedOn = `${dd}/${mm}/${yyyy}`;

			const selectedSubjects = Array.from(
				document.querySelectorAll("#selectedSubjectsList li")
			).map((li) => extractLiContent(li));

			const selectedPositions = Array.from(
				document.querySelectorAll("#selectedPositionsList li")
			).map((li) => extractLiContent(li));

			const newStaff = {
				gender: gender,
				title: title,
				first_name: firstName,
				last_name: lastName,
				phone_number: phoneNumber,
				subjects: selectedSubjects,
				position: selectedPositions,
				accountCreatedOn: accountCreatedOn,
				access_level: accessLevel,
				image: "",
				account_status: "Active",
				id: id,
			};

			try {
				const response = await fetch("http://localhost:3000/staff");
				const data = await response.json();

				// Append new staff object to staff array
				data.push(newStaff);

				const updatedResponse = await fetch("http://localhost:3000/staff", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newStaff),
				});

				// Handle json response
				const loaderModal = new bootstrap.Modal(
					document.getElementById("loaderModal")
				);
				loaderModal.show(); // Open the modal

				// Hide the loader after the timeout
				setTimeout(() => {
					const loader = document.getElementById("loadingMessage");
					const successMessage = document.getElementById("successMessage");
					const errorMessage = document.getElementById("failedMessage");
					// Hide the loader
					loader.style.display = "none";

					// Check if the account creation was successful
					if (updatedResponse.ok) {
						successMessage.style.display = "block";
						errorMessage.style.display = "none";
					} else {
						successMessage.style.display = "none";
						errorMessage.style.display = "block";
					}
				}, 3000); // 3-second timeout

				// Clear the form fields and selected items
				document.getElementById("selectGender").value = "";
				document.getElementById("newFirstName").value = "";
				document.getElementById("newLastName").value = "";
				document.getElementById("newPhoneNumber").value = "";
				document.getElementById("selectAccessLevel").value = "";
				document
					.querySelectorAll("#selectedSubjectsList li")
					.forEach((li) => li.remove());
				document
					.querySelectorAll("#selectedPositionsList li")
					.forEach((li) => li.remove());
			} catch (error) {
				console.error("Error adding new staff member:", error);
			}
		});

	function extractLiContent(liElement) {
		let content = "";
		liElement.childNodes.forEach((node) => {
			if (node.nodeName !== "SPAN" || !node.classList.contains("minus-icon")) {
				content += node.textContent;
			}
		});
		return content.trim();
	}
});

// Function to set up focus and blur events for search inputs
function setupSearchInputFocusBlur(selectElement, dataList) {
	selectElement.addEventListener("focus", function () {
		selectElement.size = dataList.length + 1;
		// Deselect any selected option
		selectElement.selectedIndex = -2;
	});

	selectElement.addEventListener("blur", function () {
		selectElement.size = 1;
	});
}
