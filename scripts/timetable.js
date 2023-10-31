document.addEventListener("DOMContentLoaded", () => {
	// Define a function to fetch JSON data
	function fetchJsonData(url) {
		return fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				return null;
			});
	}

	// Define a function to fetch JSON data
	function fetchTimetableData(callback) {
		// Fetch the JSON data
		fetch("mockData/timetable.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				// Call the callback function with the loaded data
				callback(data);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	}

	// Function to populate subjects and teachers select options
	function populateSubjectsAndTeachers() {
		fetchJsonData("mockData/staff.json")
			.then((staffData) => {
				const subjectSelect = document.getElementById("ttSelectSubject");
				const teacherSelect = document.getElementById("ttSelectTeacher");
				subjectSelect.innerHTML = "";
				teacherSelect.innerHTML = "";
				const subjectsSet = new Set();
				staffData.staff.forEach((staff) => {
					staff.subjects.forEach((subject) => {
						subjectsSet.add(subject);
					});
					const fullName = `${staff.title} ${staff.first_name} ${staff.last_name}`;
					const option = document.createElement("option");
					option.value = fullName;
					option.textContent = fullName;
					teacherSelect.appendChild(option);
				});
				subjectsSet.forEach((subject) => {
					const option = document.createElement("option");
					option.value = subject;
					option.textContent = subject;
					subjectSelect.appendChild(option);
				});
			})
			.catch((error) => {
				console.error("Error fetching staff data:", error);
			});
	}

	// Call the fetchTimetableData function
	fetchTimetableData(function (data) {
		// Function to populate the select menu with branch names
		function populateBranchSelect(data) {
			const branchSelect = document.getElementById("branch");

			// Clear any existing options
			branchSelect.innerHTML = "";

			// Add a default option
			const defaultOption = document.createElement("option");
			defaultOption.value = "0";
			defaultOption.textContent = "Choose branch";
			branchSelect.appendChild(defaultOption);

			// Loop through the branch data and add options
			data.timetable.branch.forEach((branch) => {
				const option = document.createElement("option");
				option.value = branch.name;
				option.textContent = branch.name;
				branchSelect.appendChild(option);
			});
		}

		// Call the populateBranchSelect function with the loaded data
		populateBranchSelect(data);

		// Function to create the list of classes when a branch is selected
		function createClassList(branchName) {
			const classTabs = document.getElementById("classTabs");
			classTabs.innerHTML = ""; // Clear any existing class tabs

			// Find the selected branch in the data
			const selectedBranch = data.timetable.branch.find(
				(branch) => branch.name === branchName
			);

			if (!selectedBranch) {
				return;
			}

			// Loop through the levels and classes in the selected branch
			selectedBranch.levels.forEach((level) => {
				level.class.forEach((classInfo) => {
					// Create a list item for each class
					const listItem = document.createElement("li");
					listItem.classList.add("nav-item");

					const sanitizedLinkId = `${level.name}-${classInfo.name}`.replace(
						/\s+/g,
						"_"
					); // Replace spaces with underscores

					// Create a link inside the list item
					const link = document.createElement("a");
					link.classList.add("nav-link", "timetable-link");
					link.id = sanitizedLinkId;
					link.setAttribute("data-bs-target", `#${sanitizedLinkId}`);
					link.setAttribute("data-bs-toggle", "tab");
					link.href = `#${level.name}-${classInfo.name}`;
					link.setAttribute("role", "tab");

					// Set the link text to the combination of level name and class name
					link.textContent = `${level.name} ${classInfo.name}`;

					// Append the link to the list item
					listItem.appendChild(link);

					// Append the list item to the classTabs
					classTabs.appendChild(listItem);
				});
			});

			populateSubjectsAndTeachers();
		}

		// Define a variable to store the selected class
		let selectedClass = null;

		// Event listener for branch select change
		document.getElementById("branch").addEventListener("change", (event) => {
			const selectedBranch = event.target.value;
			createClassList(selectedBranch);
		});

		// Event listener for timetable links
		document.addEventListener("click", (event) => {
			if (event.target.classList.contains("timetable-link")) {
				// Prevent default link behavior
				event.preventDefault();

				function findClassById(classId, branches) {
					// Loop through the branches and classes to find the matching class
					for (const branch of branches) {
						for (const level of branch.levels) {
							for (const classInfo of level.class) {
								const fullClassId = `${level.name}-${classInfo.name}`.replace(
									/\s+/g,
									"_"
								);
								if (fullClassId === classId) {
									return classInfo; // Return the matching class
								}
							}
						}
					}

					// Return null if the class is not found
					return null;
				}

				// Get the class ID from the clicked link's ID attribute
				const classId = event.target.id;

				// Sanitize the class ID to make it a valid selector
				const sanitizedClassId = classId.replace(/\s+/g, "_"); // Replace spaces with underscores

				// Find the selected class based on the class ID
				selectedClass = findClassById(classId, data.timetable.branch);

				// Get the tab-pane element to populate
				const tabPane = document.querySelector(".tab-pane");
				tabPane.classList.add("show", "fade", "active");

				// Set the ID of the tab-pane to match the sanitized class ID
				tabPane.id = sanitizedClassId;

				// Populate the tab-pane with timetable data
				const table = tabPane.querySelector("table");
				const tbody = table.querySelector("tbody");

				// Check if a class is selected

				// Loop through each day's schedule
				selectedClass.days.forEach((daySchedule) => {
					// Check if the current day in the loop matches the selected day
					if (daySchedule && daySchedule.name) {
						// Get the tr element for the current day
						const dayRow = document.querySelector(
							`.${daySchedule.name.toLowerCase()}`
						);

						// Loop through the schedule for the day and populate the corresponding td elements
						daySchedule.schedule.forEach((schedule, index) => {
							const periodClass = `period_${index + 1}`;
							const periodTd = dayRow.querySelector(`.${periodClass}`);

							// Create a clickable link for editing
							const editLink = document.createElement("a");
							editLink.href = "#";
							editLink.classList.add("edit-period");

							// Check if the current period is empty
							const isPeriodEmpty = !schedule.subject && !schedule.teacher;

							// Create the <i> element for the edit icon
							const editIcon = document.createElement("i");

							// Get the modal header elements
							const modalHeader = document.getElementById(
								"editPeriodModalLabel"
							);
							const addNewPeriodHeader =
								document.getElementById("addNewPeriod");

							if (isPeriodEmpty) {
								// If the cell is empty, use the plus icon
								editIcon.classList.add("bx", "bxs-plus-circle"); // Change this to the appropriate icon class for adding a new period
								// Set modal header to "Add New Period"
								modalHeader.style.display = "none";
								addNewPeriodHeader.style.display = "block";
							} else {
								// If the cell is not empty, use the edit icon
								editIcon.classList.add("bx", "bxs-edit"); // Change this to the appropriate icon class for editing a period
								// Set modal header to "Edit Period"
								modalHeader.style.display = "block";
								addNewPeriodHeader.style.display = "none";
							}

							editLink.appendChild(editIcon);

							// Add Bootstrap attributes to trigger the modal
							editLink.setAttribute("data-bs-toggle", "modal");
							editLink.setAttribute("data-bs-target", "#editPeriodModal");

							document.addEventListener("DOMContentLoaded", async () => {
								// Fetch staff data and populate subjects and staff names
								const staffData = await fetchJsonData("mockData/staff.json");

								// Log the fetched data for debugging
								console.log("Fetched Staff Data: ", staffData);

								if (staffData && staffData.staff) {
									populateSubjects(staffData);
									populateStaffNames(staffData);
								}

								// Event listener for timetable links
								document.addEventListener("click", (event) => {
									if (event.target.classList.contains("edit-period")) {
										// Prevent default link behavior
										event.preventDefault();

										// Get the corresponding timetable cell's data attributes
										const day = event.target.getAttribute("data-day");
										const period = event.target.getAttribute("data-period");
										const scheduleData =
											jsonData[day.toLowerCase()][period - 1];

										// Populate modal fields with scheduleData
										document.getElementById("ttSelectSubject").value =
											scheduleData.subject;
										document.getElementById("ttSelectTeacher").value =
											scheduleData.teacher;

										// Get the modal element
										const modal = new bootstrap.Modal(
											document.getElementById("editPeriodModal")
										);

										// Open the modal
										modal.show();

										// Handle form submission
										const form = document.querySelector(".modal-body form");
										form.addEventListener("submit", function (event) {
											event.preventDefault();

											// Get edited values from the form
											const editedSubject =
												document.getElementById("ttSelectSubject").value;
											const editedTeacher =
												document.getElementById("ttSelectTeacher").value;

											// Update jsonData with edited data
											scheduleData.subject = editedSubject;
											scheduleData.teacher = editedTeacher;

											// Update the UI to reflect changes
											const updatedCellId = `${day}-${period}`;
											const updatedCell =
												document.getElementById(updatedCellId);
											updatedCell.innerHTML = `<span class="tt-subject">${scheduleData.subject}</span><br><span class="tt-teacher">${scheduleData.teacher}</span>`;

											// Close the modal
											modal.hide();
										});

										// Log selected subject and teacher for debugging
										console.log("Selected Subject: ", scheduleData.subject);
										console.log("Selected Teacher: ", scheduleData.teacher);
									}
								});
							});

							// Create spans for subject and teacher
							const subjectSpan = document.createElement("span");
							subjectSpan.classList.add("tt-subject");
							subjectSpan.textContent = schedule.subject;

							const teacherSpan = document.createElement("span");
							teacherSpan.classList.add("tt-teacher");
							teacherSpan.textContent = schedule.teacher;

							// Clear the content of the td element before appending spans
							periodTd.innerHTML = "";

							// Append spans to the td element
							periodTd.appendChild(editLink);
							periodTd.appendChild(subjectSpan);
							periodTd.appendChild(document.createElement("br")); // Add a line break between subject and teacher
							periodTd.appendChild(teacherSpan);
						});
					}
				});
			}
		});
	});
});
