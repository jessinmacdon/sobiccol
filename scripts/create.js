document.addEventListener("DOMContentLoaded", () => {
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

document.addEventListener("DOMContentLoaded", () => {
	const branchSelect = document.getElementById("newClassbranch");
	const stageSelect = document.getElementById("newClassStage");
	const initialsInput = document.getElementById("newClassInitials");
	const classExistsMessage = document.querySelector(".addClassExists");
	const classCreatedMessage = document.querySelector(".class-created");
	const createClassBtn = document.getElementById("createClassBtn");

	// Hide the class initials input initially
	initialsInput.style.display = "none";

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

				// Clear previous options and messages
				stageSelect.innerHTML = "";
				classExistsMessage.style.display = "none";
				classCreatedMessage.style.display = "none";
				initialsInput.value = "";

				if (selectedBranchData) {
					selectedBranchData.sections[0].stages.forEach((stage) => {
						const option = document.createElement("option");
						option.value = stage.name;
						option.textContent = stage.name;
						stageSelect.appendChild(option);
					});

					stageSelect.style.display = "block";
					initialsInput.style.display = "block"; // Display class initials input
				}
			});

			// Event listener for "Add Class" button
			createClassBtn.addEventListener("click", () => {
				const selectedBranch = branchSelect.value;
				const selectedStage = stageSelect.value;
				const classInitials = initialsInput.value.toUpperCase();

				const selectedBranchData = branches.find(
					(branch) => branch.name === selectedBranch
				);

				if (selectedBranchData) {
					const selectedStageData = selectedBranchData.sections[0].stages.find(
						(stage) => stage.name === selectedStage
					);

					if (selectedStageData) {
						const classExists = selectedStageData.classes.some(
							(cls) => cls.name === classInitials
						);

						if (classExists) {
							classExistsMessage.style.display = "block";
							classCreatedMessage.style.display = "none";
						} else {
							// Create the new class
							selectedStageData.classes.push({
								name: classInitials,
								size: 0,
								classMaster: "",
								headBoy: "",
								headGirl: "",
							});

							// Display success message
							classCreatedMessage.style.display = "block";
							classExistsMessage.style.display = "none";
						}
					}
				}
			});
		})
		.catch((error) => {
			console.error("Error loading JSON data:", error);
		});
});


