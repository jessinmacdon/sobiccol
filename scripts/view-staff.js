document.addEventListener("DOMContentLoaded", function () {
	const urlParams = new URLSearchParams(window.location.search);
	const staffId = urlParams.get("staffId");

	if (staffId) {
		fetch("mockData/staff.json")
			.then((response) => response.json())
			.then((data) => {
				const clickedStaff = data.staff.find(
					(staff) => staff.id === parseInt(staffId)
				);

				if (clickedStaff) {
					const staffName = document.querySelector(".top .staff-name");
					const staffInfo = document.querySelector("main .staff-info");
					const account_statusText = document.querySelector(
						".account-status-dependent .account-status-text"
					);

					staffName.textContent = `${clickedStaff.first_name} ${clickedStaff.last_name}`;
					staffInfo.innerHTML = `
                        <div class="form-container">
                            <form>
                                <div class="form-group">
                                    <label for="first_name">First Name:</label>
                                    <input type="text" id="first_name" class="form-control" value="${
																			clickedStaff.first_name
																		}" disabled />
                                    <a href="#" class="update-field" data-field="first_name">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Last Name:</label>
                                    <input type="text" id="last_name" class="form-control" value="${
																			clickedStaff.last_name
																		}" disabled />
                                    <a href="#" class="update-field" data-field="last_name">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="title">Title:</label>
                                    <input type="text" id="title" class="form-control" value="${
																			clickedStaff.title
																		}" disabled />
                                    <a href="#" class="update-field" data-field="title">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="gender">gender:</label>
                                    <input type="text" id="gender" class="form-control" value="${
																			clickedStaff.gender
																		}" disabled />
                                    <a href="#" class="update-field" data-field="gender">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="phone_number">Phone Number:</label>
                                    <input type="text" id="phone_number" class="form-control" value="${
																			clickedStaff.phone_number
																		}" disabled />
                                    <a href="#" class="update-field" data-field="phone_number">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="adminRole">Administrative Role:</label>
									<p id="adminRole"><strong>Positions:</strong>
                                    ${clickedStaff.position}</p>
                                    <a href="#" class="edit-position" data-field="adminRole" id="edit">Edit</a>
                                </div>
                                <div class="form-group">
                                    <label for="subjects"></label>
                                    <p id="subjects"><strong>Subjects:</strong>${
																			clickedStaff.subjects
																		}
                                    <a href="#" class="edit-subjects" data-field="subjects" id="editSubjects">Edit</a>
                                </div>
                            </form>
                        </div>
                        <p><strong>Account Created On:</strong> ${
													clickedStaff.accountCreatedOn
												}</p>
						<p><strong>Account Status:</strong> <span class="${
							clickedStaff.account_status === "Active"
								? "text-success"
								: "text-danger"
						}" id="${
						clickedStaff.account_status === "active"
							? "textActive"
							: "textInactive"
					}">${clickedStaff.account_status}</span></p>
                        <div class="image-container">
                            <img src="assets/staff-profile/${
															clickedStaff.image
														}" alt="Staff Image" class="staff-image" />
                        </div>
                        
                    `;

					const updateLinks = document.querySelectorAll(".update-field");
					updateLinks.forEach((link) => {
						link.addEventListener("click", function (event) {
							event.preventDefault();
							const field = event.target.getAttribute("data-field");
							const input = document.getElementById(field);

							if (input.hasAttribute("disabled")) {
								input.removeAttribute("disabled");
								link.textContent = "Save Changes";
							} else {
								input.setAttribute("disabled", true);
								link.textContent = "Update";
							}
						});
					});

					// Dynamically show/hide buttons based on account status
					const deactivateBtn = document.querySelector(".deactivate-btn");
					const activateBtn = document.querySelector(".activate-btn");

					if (clickedStaff.account_status === "Active") {
						deactivateBtn.style.display = "block";
						activateBtn.style.display = "none";
					} else {
						deactivateBtn.style.display = "none";
						activateBtn.style.display = "block";
					}
				}
			})
			.catch((error) => console.error("Error fetching staff data:", error));
	}

	// Populate select fields when the page loads
	fetch("mockData/subjects.json")
		.then((response) => response.json())
		.then((subjectsData) => {
			const subjectSelectField = document.getElementById("subjectSelectField");
			populateSelectFields(subjectSelectField, subjectsData.subjects);
		});

	fetch("mockData/positions.json")
		.then((response) => response.json())
		.then((positionsData) => {
			const positionSelectField = document.getElementById(
				"positionSelectField"
			);
			populateSelectFields(positionSelectField, positionsData.positions);
		});
});
