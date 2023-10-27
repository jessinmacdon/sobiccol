// Function to populate select element with unique subjects
function populateSubjects(data) {
	const subjectsSet = new Set(); // Use a Set to store unique subjects

	data.staff.forEach((staff) => {
		staff.subjects.forEach((subject) => {
			subjectsSet.add(subject); // Add subjects to the Set
		});
	});

	const subjectSelect = document.getElementById("ttSelectSubject");
	subjectsSet.forEach((subject) => {
		const option = document.createElement("option");
		option.value = subject;
		option.textContent = subject;
		subjectSelect.appendChild(option);
	});

	// Log subjects for debugging
	console.log("Subjects: ", subjectsSet);
}

// Function to populate select element with staff names
function populateStaffNames(data) {
	const staffSelect = document.getElementById("ttSelectTeacher");
	data.staff.forEach((staff) => {
		const fullName = `${staff.title} ${staff.first_name} ${staff.last_name}`;
		const option = document.createElement("option");
		option.value = fullName;
		option.textContent = fullName;
		staffSelect.appendChild(option);
	});

	// Log staff names for debugging
	console.log("Staff Names: ", data.staff);
}
