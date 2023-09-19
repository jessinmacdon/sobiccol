// Create a module to manage class data
const ClassDataModule = (() => {
	let classData = null;

	const fetchData = async () => {
		if (!classData) {
			const response = await fetch("mockData/class.json");
			classData = await response.json();
		}
		return classData;
	};

	return {
		fetchData,
	};
})();

// Function to create and display the class structure for the entire school
function createTable(branchName, sectionName, stages) {
	const table = document.createElement("table");
	table.className = "class-table";

	// Create table header
	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	const headerBranch = document.createElement("th");
	headerBranch.textContent = "Branch";
	const headerSection = document.createElement("th");
	headerSection.textContent = "Section";

	headerRow.appendChild(headerBranch);
	headerRow.appendChild(headerSection);

	for (const stage of stages) {
		const headerStage = document.createElement("th");
		headerStage.textContent = stage.name;
		headerRow.appendChild(headerStage);
	}

	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Create table body
	const tbody = document.createElement("tbody");
	const bodyRow = document.createElement("tr");
	const bodyBranch = document.createElement("td");
	bodyBranch.textContent = branchName;
	const bodySection = document.createElement("td");
	bodySection.textContent = sectionName;

	bodyRow.appendChild(bodyBranch);
	bodyRow.appendChild(bodySection);

	for (const stage of stages) {
		const bodyStage = document.createElement("td");
		const classNames = stage.classes.map((cls) => cls.name).join(", ");

		// Add class-name class to the cell for styling and click event
		bodyStage.classList.add("class-name");
		bodyStage.setAttribute("data-class-index", stage.classes[0].index); // Storing the class index
		bodyStage.textContent = classNames;

		bodyRow.appendChild(bodyStage);
	}

	tbody.appendChild(bodyRow);
	table.appendChild(tbody);

	return table;
}

// Function to populate the branch and stage select elements
const populateBranchAndStageSelects = (branches) => {
	const branchSelect = document.getElementById("branch");
	const stageSelect = document.getElementById("stage");

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
};

// Function to populate the class buttons container
const populateClassButtons = (selectedStageData) => {
	const classButtonsContainer = document.getElementById("newStudClassButtons");
	classButtonsContainer.innerHTML = "";

	if (selectedStageData) {
		selectedStageData.classes.forEach((cls) => {
			const classButton = document.createElement("div");
			classButton.className = "btn class-btn";
			classButton.textContent = cls.name; // Display class name
			classButtonsContainer.appendChild(classButton);
		});

		classButtonsContainer.style.display = "block";
	}
};

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const classData = await ClassDataModule.fetchData();
		const branches = classData.branches;

		// Populate branch and stage select elements
		populateBranchAndStageSelects(branches);

		// Process and create class tables
		const classTables = document.querySelector(".class-tables");
		for (const branch of branches) {
			for (const section of branch.sections) {
				const table = createTable(branch.name, section.name, section.stages);
				classTables.appendChild(table);
			}
		}

		// Event listener for class names
		const classNames = document.querySelectorAll(".class-name");
		classNames.forEach((className) => {
			className.addEventListener("click", async () => {
				const classIndex = parseInt(className.getAttribute("data-class-index"));
				const classListResponse = await fetch("mockData/form1a.json");
				const classListData = await classListResponse.json();

				const classListModal = document.querySelector(".modal-classlist");
				const modalContent = classListModal.querySelector(".modal-table-body");
				modalContent.innerHTML = "";

				// Populate modal with class list content
				const classData = classListData.students;
				classData.forEach((student, index) => {
					const row = document.createElement("tr");
					row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.first_name} ${student.last_name}</td>
          `;

					if (
						student.first_name === classListData.class_master.first_name &&
						student.last_name === classListData.class_master.last_name
					) {
						row.querySelector("td:last-child").classList.add("class-master");
					} else if (
						student.first_name === classListData.head_boy.first_name &&
						student.last_name === classListData.head_boy.last_name
					) {
						row.querySelector("td:last-child").classList.add("head-boy");
					} else if (
						student.first_name === classListData.head_girl.first_name &&
						student.last_name === classListData.head_girl.last_name
					) {
						row.querySelector("td:last-child").classList.add("head-girl");
					}

					modalContent.appendChild(row);
				});

				// Show the modal
				const modal = new bootstrap.Modal(classListModal);
				modal.show();
			});
		});

		// Event listener for stage select
		const stageSelect = document.getElementById("stage");
		stageSelect.addEventListener("change", () => {
			const selectedBranch = branchSelect.value;
			const selectedBranchData = branches.find(
				(branch) => branch.name === selectedBranch
			);

			if (selectedBranchData) {
				const selectedStage = stageSelect.value;
				const selectedStageData = selectedBranchData.sections[0].stages.find(
					(stage) => stage.name === selectedStage
				);

				populateClassButtons(selectedStageData);
			}
		});
	} catch (error) {
		console.error("Error fetching or processing data:", error);
	}
});
