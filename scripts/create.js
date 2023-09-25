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

document.addEventListener("DOMContentLoaded", () => {});

// Function to create the list of classes when a branch is selected
function createClassList(branchName) {
	const classTabs = document.getElementById("classTabs");
	classTabs.innerHTML = ""; // Clear any existing class tabs

	// Find the selected branch in the data
	const selectedBranch = data.calendar.branch.find(
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
			listItem.classList.add("nav-item", "active");

			// Create a link inside the list item
			const link = document.createElement("a");
			link.classList.add("nav-link", "timetable-link");
			link.id = `#${level.name}-${classInfo.name}`;
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

// Event listener for branch select change
document.getElementById("branch").addEventListener("change", (event) => {
	const selectedBranch = event.target.value;
	createClassList(selectedBranch);
});


// Define variables for each period tr element
const firstPeriod = document.querySelector(".period_1");
const secondPeriod = document.querySelector(".period_2");
const thirdPeriod = document.querySelector(".period_3");
const fourthPeriod = document.querySelector(".period_4");
const fifthPeriod = document.querySelector(".period_5");
const sixthPeriod = document.querySelector(".period_6");