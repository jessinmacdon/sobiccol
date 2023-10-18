document.addEventListener("DOMContentLoaded", () => {
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

							// Create the <i> element for the edit icon
							const editIcon = document.createElement("i");
							editIcon.classList.add("bx", "bxs-edit");
							editLink.appendChild(editIcon);

							// Add Bootstrap attributes to trigger the modal
							editLink.setAttribute("data-bs-toggle", "modal");
							editLink.setAttribute("data-bs-target", "#editPeriodModal");

							document.addEventListener("click", (event) => {
								const target = event.target;

								// Check if the clicked element is an edit link inside a timetable cell
								if (target.classList.contains("edit-period")) {
									event.preventDefault();

									// Get the corresponding timetable cell's data attributes
									const day = target.getAttribute("data-day");
									const period = target.getAttribute("data-period");
									const scheduleData = jsonData[day.toLowerCase()][period - 1];

									// Populate modal fields with scheduleData
									document.getElementById("ttSelectSubject").innerHTML = "";
									document.getElementById("ttSelectTeacher").innerHTML = "";

									// Fetch subjects data
									fetch("mockData/subjects.json")
										.then((response) => response.json())
										.then((subjectsData) => {
											// Populate the subject select options (both first_cycle and second_cycle)
											const subjects = subjectsData.subjects;
											const subjectSelect =
												document.getElementById("ttSelectSubject");
											subjects.first_cycle.forEach((subject) => {
												const option = document.createElement("option");
												option.value = subject.name;
												option.textContent = subject.name;
												subjectSelect.appendChild(option);
											});

											subjects.second_cycle.forEach((subject) => {
												const option = document.createElement("option");
												option.value = subject.name;
												option.textContent = subject.name;
												subjectSelect.appendChild(option);
											});

											// Set the selected subject
											subjectSelect.value = scheduleData.subject;
										})
										.catch((error) => {
											console.error("Error fetching subjects:", error);
										});

									// Fetch teachers data
									fetch("mockData/staff.json")
										.then((response) => response.json())
										.then((staffData) => {
											// Populate the teacher select options
											const teachers = staffData.staff;
											const teacherSelect =
												document.getElementById("ttSelectTeacher");
											teachers.forEach((teacher) => {
												const option = document.createElement("option");
												option.value =
													teacher.first_name + " " + teacher.last_name;
												option.textContent =
													teacher.first_name + " " + teacher.last_name;
												teacherSelect.appendChild(option);
											});

											// Set the selected teacher
											teacherSelect.value = scheduleData.teacher;
										})
										.catch((error) => {
											console.error("Error fetching teachers:", error);
										});

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
										const updatedCell = document.getElementById(updatedCellId);
										updatedCell.innerHTML = `<span class="tt-subject">${scheduleData.subject}</span><br><span class="tt-teacher">${scheduleData.teacher}</span>`;

										// Close the modal
										modal.hide();
									});
								}
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
