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
});
