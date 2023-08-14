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

			studentListContainer.addEventListener("click", function (event) {
				const clickedStudentName = event.target.textContent;
				const clickedStudent = data.students.find(
					(student) =>
						`${student.first_name} ${student.last_name}` === clickedStudentName
				);

				if (clickedStudent) {
					const modalBody = document.querySelector(".student-modal-body");
					modalBody.innerHTML = `
						<div class="student-details">
							<div class="student-image">
								<img src="${clickedStudent.student_image}" alt="Student Image" />
							</div>
							<div class="student-info">
								<h4>${clickedStudent.first_name} ${clickedStudent.last_name}</h4>
								<p><strong>Student ID:</strong> ${clickedStudent.student_id}</p>
								<p><strong>Branch:</strong> ${clickedStudent.branch}</p>
								<p><strong>Class:</strong> ${clickedStudent.class}</p>
								<p><strong>Date of Birth:</strong> ${clickedStudent.date_of_birth}</p>
								<p><strong>Parent/Guardian:</strong> ${clickedStudent.parent_guardian}</p>
								<p><strong>Enrolment Date:</strong> ${clickedStudent.enrolment_date}</p>
								<p><strong>Remarks:</strong> ${clickedStudent.remarks}</p>
								<div class="update-fields">
									<label for="remarks">Remarks:</label>
									<input
										type="text"
										id="remarks"
										class="form-control"
										value="${clickedStudent.remarks}"
										disabled
									/>
									<a href="#" class="update-field" data-field="remarks">Update</a>
								</div>
							</div>
						</div>
					`;

					const updateLinks = modalBody.querySelectorAll(".update-field");
					updateLinks.forEach((link) => {
						link.addEventListener("click", function (event) {
							event.preventDefault();
							const field = event.target.getAttribute("data-field");
							const input = modalBody.querySelector(`#${field}`);

							if (input.hasAttribute("disabled")) {
								input.removeAttribute("disabled");
								link.textContent = "Save Changes";
							} else {
								input.setAttribute("disabled", true);
								link.textContent = "Update";
							}
						});
					});

					const studentModal = new bootstrap.Modal(
						document.getElementById("studentModal")
					);
					studentModal.show();
				}
			});
		})
		.catch((error) => console.error("Error fetching student data:", error));
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

// Listen for the modal's hide event to properly offload the modal
document.addEventListener("hide.bs.modal", function () {
	studentModal = null;
});
