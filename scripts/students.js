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
								<div class="remarks-section">
                        			<label for="remarks">Remarks:</label>
                        			<textarea
                            			id="remarks"
                            			class="form-control"
                            			placeholder="Add a remark..."
                        			>
									</textarea>
                        			<a href="#" class="add-remark-btn" data-field="remarks">Add Remark</a>
                        			<ul class="remarks-list"></ul>
                    			</div>
							</div>
						</div>
					`;

					const addRemarkBtn = modalBody.querySelector(".add-remark-btn");
					const remarksList = modalBody.querySelector(".remarks-list");

					// If remarks are not already an array, convert them into an array
					if (!Array.isArray(clickedStudent.remarks)) {
						clickedStudent.remarks = [];
					}

					//Each remark will receive a date and string. Date signifying the date the remark was added and the remark that was added.
					addRemarkBtn.addEventListener("click", function (event) {
						event.preventDefault();
						const field = event.target.getAttribute("data-field");
						const textarea = modalBody.querySelector(`#${field}`);

						if (textarea.value.trim() !== "") {
							const newRemark = {
								date: new Date().toISOString(),
								text: textarea.value,
							};

							clickedStudent.remarks.push(newRemark);

							// Update JSON data with the new remarks array
							updateStudentJSON(data);

							const remarkItem = document.createElement("li");
							remarkItem.innerHTML = `
            <span>${newRemark.date}</span>
            <p>${newRemark.text}</p>
        `;
							remarksList.appendChild(remarkItem);

							addRemarkBtn.textContent = "Remark Added"; // Change button text

							textarea.value = "";
						}
					});

					//you will get a few errors here which can be easily fixed when you add the http requests. THe PUT method is not allowed when updating json files locally. Reach out to me if you need more info on this part but the general interaction works well. works.
					function updateStudentJSON(data) {
						// Update the JSON data in this function
						fetch("mockData/students.json", {
							method: "PUT", // Use the appropriate HTTP method
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(data),
						})
							.then((response) => response.json())
							.then((updatedData) => {
								console.log("JSON data updated:", updatedData);
							})
							.catch((error) => {
								console.error("Error updating JSON data:", error);
							});
					}

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
