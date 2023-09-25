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
				if (selectedClass && selectedClass.days) {
					// Loop through each day's schedule
					selectedClass.days.forEach((daySchedule) => {
						// Loop through the schedule for the day
						daySchedule.schedule.forEach((schedule) => {
							// Create a td element for each schedule
							const period = document.createElement("td");

							// Set the class of the td element to the schedule name
							period.classList.add(`${schedule.name}`);

							// Create a span for the subject
							const subjectSpan = document.createElement("span");
							subjectSpan.classList.add(`${schedule.name}-subject`);
							subjectSpan.textContent = schedule.subject;
							period.appendChild(subjectSpan);

							// Create a span for the teacher
							const teacherSpan = document.createElement("span");
							teacherSpan.classList.add(`${schedule.name}-teacher`);
							teacherSpan.textContent = schedule.teacher;
							period.appendChild(teacherSpan);
                            
							// Log the created <td> element to the console
							console.log(period);

							// Find the corresponding tr element based on scheduleName
							const tr = tbody.querySelector(`.${schedule.name}`);

							// Append the td to the corresponding tr
							tr.appendChild(period);
						});
					});
				}
			}
		});
	});
});
