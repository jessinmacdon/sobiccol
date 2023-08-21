document.addEventListener("DOMContentLoaded", function () {
	const activateBtn = document.querySelector(".activate-btn");
	const deactivateBtn = document.querySelector(".deactivate-btn");

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
					const accountStatusText = document.querySelector(
						".account-status-dependent .account-status-text"
					);

					staffName.textContent = `${clickedStaff.firstName} ${clickedStaff.lastName}`;
					staffInfo.innerHTML = `
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

					if (clickedStaff.accountStatus === "Active") {
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
});
