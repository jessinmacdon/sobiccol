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

	// Fetch subjects and positions data
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
			const selectedOption = selectElement.options[selectElement.selectedIndex];
			if (selectedOption.value !== "") {
				onChangeCallback(selectedOption, listElement);
			}
		});
	}

	// Function to add selected item to the list
	function addSelectedItem(selectedOption, listElement) {
		const listItem = document.createElement("li");
		listItem.textContent = selectedOption.textContent;

		const minusIcon = document.createElement("i");
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

	// Set up listeners for subjects and positions
	setupRemoveListener(selectedSubjectsList, subjectsSelect);
	setupRemoveListener(selectedPositionsList, positionsSelect);

	// Setup search listener for subjects
	setupSearchListener(
		subjectSearchInput,
		subjectsSelect,
		subjectsData.subjects["first cycle"],
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
