document.addEventListener("DOMContentLoaded", async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const staffId = urlParams.get("staffId");

	if (staffId) {
		fetch("mockData/staff.json")
			.then((response) => response.json())
			.then((data) => {
				const clickedStaff = data.staff.find(
					(staff) => staff.id === parseInt(staffId)
				);

				if (clickedStaff) {
					const staffName = document.querySelector(".top .staff-name");
					const staffInfo = document.querySelector("main .staff-info");
					const account_statusText = document.querySelector(
						".account-status-dependent .account-status-text"
					);

					staffName.textContent = `${clickedStaff.first_name} ${clickedStaff.last_name}`;
					staffInfo.innerHTML = `
                        <div class="form-container">
                            <form>
                                <div class="form-group">
                                    <label for="first_name">First Name:</label>
                                    <input type="text" id="first_name" class="form-control" value="${
																			clickedStaff.first_name
																		}" disabled />
                                    <a href="#" class="update-field" data-field="first_name">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Last Name:</label>
                                    <input type="text" id="last_name" class="form-control" value="${
																			clickedStaff.last_name
																		}" disabled />
                                    <a href="#" class="update-field" data-field="last_name">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="title">Title:</label>
                                    <input type="text" id="title" class="form-control" value="${
																			clickedStaff.title
																		}" disabled />
                                    <a href="#" class="update-field" data-field="title">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="gender">gender:</label>
                                    <input type="text" id="gender" class="form-control" value="${
																			clickedStaff.gender
																		}" disabled />
                                    <a href="#" class="update-field" data-field="gender">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="phone_number">Phone Number:</label>
                                    <input type="text" id="phone_number" class="form-control" value="${
																			clickedStaff.phone_number
																		}" disabled />
                                    <a href="#" class="update-field" data-field="phone_number">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="adminRole">Administrative Role:</label>
									<p id="adminRole"><strong>Positions:</strong>
                                    ${clickedStaff.position}</p>
                                    <a href="#" class="edit-position" data-field="adminRole" id="editPositions" data-bs-toggle="modal" data-bs-target="#editPositionModal" data-field="subjects">Edit</a>
                                </div>
                                <div class="form-group">
                                    <label for="subjects"></label>
                                    <p id="subjects"><strong>Subjects:</strong>${
																			clickedStaff.subjects
																		}
                                    <a href="#" class="edit-subject" data-bs-toggle="modal" data-bs-target="#editSubjectModal" data-field="subjects" id="editSubjects">Edit</a>
                                </div>
                            </form>
                        </div>
                        <p><strong>Account Created On:</strong> ${
													clickedStaff.accountCreatedOn
												}</p>
						<p><strong>Account Status:</strong> <span class="${
							clickedStaff.account_status === "Active"
								? "text-success"
								: "text-danger"
						}" id="${
						clickedStaff.account_status === "active"
							? "textActive"
							: "textInactive"
					}">${clickedStaff.account_status}</span></p>
                        <div class="image-container">
                            <img src="assets/staff-profile/${
															clickedStaff.image
														}" alt="Staff Image" class="staff-image" />
                        </div>
                        
                    `;

					const updateLinks = document.querySelectorAll(".update-field");
					updateLinks.forEach((link) => {
						link.addEventListener("click", function (event) {
							event.preventDefault();
							const field = event.target.getAttribute("data-field");
							const input = document.getElementById(field);

							if (input.hasAttribute("disabled")) {
								input.removeAttribute("disabled");
								link.textContent = "Save Changes";
							} else {
								input.setAttribute("disabled", true);
								link.textContent = "Update";
							}
						});
					});

					// Dynamically show/hide buttons based on account status
					const deactivateBtn = document.querySelector(".deactivate-btn");
					const activateBtn = document.querySelector(".activate-btn");

					if (clickedStaff.account_status === "Active") {
						deactivateBtn.style.display = "block";
						activateBtn.style.display = "none";
					} else {
						deactivateBtn.style.display = "none";
						activateBtn.style.display = "block";
					}
				}
			})
			.catch((error) => console.error("Error fetching staff data:", error));
	}

	// Populate select fields when the page loads
	fetch("mockData/subjects.json")
		.then((response) => response.json())
		.then((subjectsData) => {
			const subjectSelectField = document.getElementById("subjectSelectField");
			populateSelectFields(subjectSelectField, subjectsData.subjects);
		});

	fetch("mockData/positions.json")
		.then((response) => response.json())
		.then((positionsData) => {
			const positionSelectField = document.getElementById(
				"positionSelectField"
			);
			populateSelectFields(positionSelectField, positionsData.positions);
		});

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
			placeholderOption.text = "Select at least one option";
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
			...subjectsData.subjects["first_cycle"],
			...subjectsData.subjects["second_cycle"],
		];

		// Add a placeholder option for default selection
		function addPlaceholderOption(selectElement) {
			const placeholderOption = document.createElement("option");
			placeholderOption.value = "";
			placeholderOption.text = "Select a position";
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

	// When the "Add Subject" button in the popover is clicked, open the Add Subject modal
	document
		.getElementById("addSubjectPopover")
		.addEventListener("click", function () {
			var modal = new bootstrap.Modal(
				document.getElementById("addSubjectModal"),
				{
					backdrop: "static", // Prevent closing on outside click
				}
			);
			modal.show();
		});

	// When the "Add Position" button in the popover is clicked, open the Add Position modal
	document
		.getElementById("addPositionPopover")
		.addEventListener("click", function () {
			var modal = new bootstrap.Modal(
				document.getElementById("addPositionModal"),
				{
					backdrop: "static", // Prevent closing on outside click
				}
			);
			modal.show();
		});

	//Save guarded code
	async function addNewSubject() {
		const subjectName = document.getElementById("addSubjectInput").value;
		const coefficientSelect = document.getElementById("coefficientSelectField");
		const coefficient =
			coefficientSelect.options[coefficientSelect.selectedIndex].value;
		const coefficientExamSelect = document.getElementById(
			"coefficientExamSelectField"
		);
		const coefficientExam =
			coefficientExamSelect.options[coefficientExamSelect.selectedIndex].value;
		const levelSelect = document.getElementById("levelSelectField");
		const level = levelSelect.options[levelSelect.selectedIndex].value;

		let cycle, newSubjectName;
		if (level === "OL") {
			cycle = "first_cycle";
			newSubjectName = subjectName;
		} else {
			cycle = "second_cycle";
			newSubjectName = "AL " + subjectName;
		}

		const newSubject = {
			name: newSubjectName,
			coefficient: coefficient,
			coefficient_exam_class: coefficientExam,
		};

		try {
			// Fetch existing subjects data
			const response = await fetch("http://localhost:3000/subjects");
			const subjectsData = await response.json();

			// Check if the subject already exists in the selected cycle
			if (isSubjectExists(newSubjectName, subjectsData.subjects[cycle])) {
				alert("This subject already exists in the database.");
				return;
			}

			// Add the new subject to the existing data
			subjectsData.subjects[cycle].push(newSubject);

			// Update the subjects data on the server
			const updatedResponse = await fetch("http://localhost:3000/subjects", {
				method: "PUT", // Use the appropriate HTTP method for updating
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subjectsData),
			});

			if (updatedResponse.ok) {
				alert("New subject successfully added.");
			} else {
				alert("Failed to add the new subject.");
			}

			// Automatically add the newly added subject to the select options
			const subjectsSelect = document.getElementById("subjectSelectField");
			const newOption = document.createElement("option");
			newOption.value = newSubjectName;
			newOption.text = newSubjectName;
			subjectsSelect.appendChild(newOption);
			subjectsSelect.value = newSubjectName;

			closeModal("addSubjectModal");
		} catch (error) {
			console.error("Error adding new subject:", error);
		}
	}

	async function addNewPosition() {
		const positionName = document.getElementById("addPositionInput").value;
		const positionTypeSelect = document.getElementById(
			"positionTypeSelectField"
		);
		const positionType =
			positionTypeSelect.options[positionTypeSelect.selectedIndex].value;

		try {
			// Fetch existing positions data
			const response = await fetch("http://localhost:3000/positions");
			const positionsData = await response.json();

			// Check if the position already exists
			if (
				isPositionExists(
					positionName,
					positionType === "1"
						? positionsData.position.staff
						: positionsData.position.student
				)
			) {
				alert("This position already exists in the database.");
				return;
			}

			// Add the new position to the appropriate array
			if (positionType === "1") {
				positionsData.position.staff.push(positionName);
			} else {
				positionsData.position.student.push(positionName);
			}

			// Update the positions data on the server
			const updatedResponse = await fetch("http://localhost:3000/positions", {
				method: "PUT", // Use the appropriate HTTP method for updating
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(positionsData),
			});

			if (updatedResponse.ok) {
				alert("New position successfully added.");
			} else {
				alert("Failed to add the new position.");
			}

			// Automatically add the newly added position to the select options
			const positionsSelect = document.getElementById("positionSelectField");
			const newOption = document.createElement("option");
			newOption.value = positionName;
			newOption.text = positionName;
			positionsSelect.appendChild(newOption);
			positionsSelect.value = positionName;

			closeModal("addPositionModal");
		} catch (error) {
			console.error("Error adding new position:", error);
		}
	}
});
