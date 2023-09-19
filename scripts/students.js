document.addEventListener("DOMContentLoaded", function () {
	fetch("mockData/students.json")
		.then((response) => response.json())
		.then((data) => {
			const studentListContainer = document.querySelector(".student-list");

			data.students.forEach((student) => {
				const fullName = `${student.first_name} ${student.last_name}`;
				const studentListItem = document.createElement("div");
				studentListItem.className = "student-list-item";
				studentListItem.textContent = fullName;
				studentListContainer.appendChild(studentListItem);
			});

			const searchStudInput = document.querySelector(".search-stud-input");
			const studNotFound = document.querySelector(".error-message-stud");

			searchStudInput.addEventListener("input", function () {
				const searchTerm = searchStudInput.value.toLowerCase();
				const studentItems = document.querySelectorAll(".student-list-item");
				let found = false;

				studentItems.forEach((item) => {
					const studentName = item.textContent.toLowerCase();
					if (studentName.indexOf(searchTerm) !== -1) {
						item.style.display = "block";
						found = true;
					} else {
						item.style.display = "none";
					}
				});

				if (!found) {
					studNotFound.style.display = "block";
				} else {
					studNotFound.style.display = "none";
				}
			});

			studentListContainer.addEventListener("click", function (event) {
				const clickedStudentName = event.target.textContent;
				const clickedStudent = data.students.find(
					(student) =>
						`${student.first_name} ${student.last_name}` === clickedStudentName
				);

				if (clickedStudent) {
					const studentId = clickedStudent.id;
					window.location.href = `view-student.html?id=${studentId}`;
				}
			});
		})
		.catch((error) => console.error("Error fetching student data:", error));

	const branchSelect = document.getElementById("newStudbranch");
	const stageSelect = document.getElementById("newStudStage");
	const classButtonsContainer = document.getElementById("newStudClassButtons");

	// Load JSON data
	fetch("mockData/class.json")
		.then((response) => response.json())
		.then((data) => {
			const branches = data.branches;

			// Populate branch select
			branches.forEach((branch) => {
				const option = document.createElement("option");
				option.value = branch.name;
				option.textContent = branch.name;
				branchSelect.appendChild(option);
			});

			// Event listener for branch select
			branchSelect.addEventListener("change", () => {
				const selectedBranch = branchSelect.value;
				const selectedBranchData = branches.find(
					(branch) => branch.name === selectedBranch
				);

				// Clear previous options
				stageSelect.innerHTML = "";
				classButtonsContainer.innerHTML = "";

				if (selectedBranchData) {
					selectedBranchData.sections[0].stages.forEach((stage) => {
						const option = document.createElement("option");
						option.value = stage.name;
						option.textContent = stage.name;
						stageSelect.appendChild(option);
					});

					stageSelect.style.display = "block";
				}
			});

			// Event listener for stage select
			stageSelect.addEventListener("change", () => {
				classButtonsContainer.innerHTML = "";

				const selectedBranch = branchSelect.value;
				const selectedBranchData = branches.find(
					(branch) => branch.name === selectedBranch
				);

				if (selectedBranchData) {
					const selectedStage = stageSelect.value;
					const selectedStageData = selectedBranchData.sections[0].stages.find(
						(stage) => stage.name === selectedStage
					);

					if (selectedStageData) {
						selectedStageData.classes.forEach((cls) => {
							const classButton = document.createElement("div");
							classButton.className = "btn class-btn";
							classButton.textContent = cls.name; // Display class name
							classButtonsContainer.appendChild(classButton);
						});

						classButtonsContainer.style.display = "block";
					}
				}
			});
		})
		.catch((error) => {
			console.error("Error loading JSON data:", error);
		});
});
