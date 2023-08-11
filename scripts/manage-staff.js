document.addEventListener("DOMContentLoaded", function () {
	fetch("mockData/staff.json")
		.then((response) => response.json())
		.then((data) => {
			const staffListContainer = document.querySelector(".staff-list");

			data.staff.forEach((staff) => {
				const fullName = `${staff.firstName} ${staff.lastName}`;
				const staffListItem = document.createElement("div");
				staffListItem.className = "staff-list-item";
				staffListItem.textContent = fullName;
				staffListContainer.appendChild(staffListItem);
			});

			staffListContainer.addEventListener("click", function (event) {
				const clickedStaffName = event.target.textContent;
				const clickedStaff = data.staff.find(
					(staff) => `${staff.firstName} ${staff.lastName}` === clickedStaffName
				);

				if (clickedStaff) {
					const modalBody = document.querySelector(".modal-body");
					modalBody.innerHTML = `
                        <div class="form-container">
                            <form>
                                <div class="form-group">
                                    <label for="firstName">First Name:</label>
                                    <input type="text" id="firstName" class="form-control" value="${
																			clickedStaff.firstName
																		}" disabled />
                                    <a href="#" class="update-field" data-field="firstName">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name:</label>
                                    <input type="text" id="lastName" class="form-control" value="${
																			clickedStaff.lastName
																		}" disabled />
                                    <a href="#" class="update-field" data-field="lastName">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="title">Title:</label>
                                    <input type="text" id="title" class="form-control" value="${
																			clickedStaff.title
																		}" disabled />
                                    <a href="#" class="update-field" data-field="title">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="sex">Sex:</label>
                                    <input type="text" id="sex" class="form-control" value="${
																			clickedStaff.sex
																		}" disabled />
                                    <a href="#" class="update-field" data-field="sex">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="phoneNumber">Phone Number:</label>
                                    <input type="text" id="phoneNumber" class="form-control" value="${
																			clickedStaff.phoneNumber
																		}" disabled />
                                    <a href="#" class="update-field" data-field="phoneNumber">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="adminRole">Administrative Role:</label>
                                    <input type="text" id="adminRole" class="form-control" value="${
																			clickedStaff.adminRole
																		}" disabled />
                                    <a href="#" class="update-field" data-field="adminRole">Update</a>
                                </div>
                                <div class="form-group">
                                    <label for="subjects">Subjects:</label>
                                    <input type="text" id="subjects" class="form-control" value="${clickedStaff.subjects.join(
																			", "
																		)}" disabled />
                                    <a href="#" class="update-field" data-field="subjects">Update</a>
                                </div>
                            </form>
                        </div>
                        <p><strong>Account Created On:</strong> ${
													clickedStaff.accountCreatedOn
												}</p>
						<p><strong>Account Status:</strong> <span class="${
							clickedStaff.accountStatus === "Active"
								? "text-success"
								: "text-danger"
						}" id="${
						clickedStaff.accountStatus === "active"
							? "textActive"
							: "textInactive"
					}">${clickedStaff.accountStatus}</span></p>
                        <div class="image-container">
                            <img src="assets/staff-profile/${
															clickedStaff.image
														}" alt="Staff Image" class="staff-image" />
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

					// Dynamically show/hide buttons based on account status
					const deactivateBtn = document.querySelector(".deactivate-btn");
					const activateBtn = document.querySelector(".activate-btn");

					if (clickedStaff.accountStatus === "Active") {
						deactivateBtn.style.display = "block";
						activateBtn.style.display = "none";
					} else {
						deactivateBtn.style.display = "none";
						activateBtn.style.display = "block";
					}

					const staffModal = new bootstrap.Modal(
						document.getElementById("staffModal")
					);
					staffModal.show();
				}
			});
		})
		.catch((error) => console.error("Error fetching staff data:", error));
});

const searchInput = document.querySelector(".search-staff");
const errorMessage = document.querySelector(".error-message"); // Select the error message element

searchInput.addEventListener("input", function () {
	const searchTerm = searchInput.value.toLowerCase();
	const staffItems = document.querySelectorAll(".staff-list-item");
	let found = false; // Add a flag to track if any results are found

	staffItems.forEach((item) => {
		const staffName = item.textContent.toLowerCase();
		if (staffName.indexOf(searchTerm) !== -1) {
			item.style.display = "block";
			found = true; // Update the flag when results are found
		} else {
			item.style.display = "none";
		}
	});

	// Show/hide the error message based on the flag
	if (!found) {
		errorMessage.style.display = "block"; // Show the error message
	} else {
		errorMessage.style.display = "none"; // Hide the error message
	}
});

// Listen for the modal's hide event to properly offload the modal
document.addEventListener("hide.bs.modal", function () {
	staffModal = null; // Reset the modal instance
});
