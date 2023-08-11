document.addEventListener("DOMContentLoaded", function () {
	let staffModal; // Declare a variable to store the modal instance

	fetch("mockData/staff.json")
		.then((response) => response.json())
		.then((data) => {
			const staffListContainer = document.querySelector(".staff-list");

			// Display staff names in the list
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
                        <p><strong>Name:</strong> ${clickedStaff.firstName} ${
						clickedStaff.lastName
					}</p>
                        <p><strong>Title:</strong> ${clickedStaff.title}</p>
                        <p><strong>Sex:</strong> ${clickedStaff.sex}</p>
                        <p><strong>Phone Number:</strong> ${
													clickedStaff.phoneNumber
												}</p>
                        <p><strong>Administrative Role:</strong> ${
													clickedStaff.adminRole
												}</p>
                        <p><strong>Subjects:</strong> ${clickedStaff.subjects.join(
													", "
												)}</p>
                        <p><strong>Account Created On:</strong> ${
													clickedStaff.accountCreatedOn
												}</p>
                        <p><strong>Access Level:</strong> ${
													clickedStaff.accessLevel
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
                    `;

					const modalFooter = document.querySelector(".modal-footer");
					modalFooter.innerHTML = ""; // Clear any previous buttons

					const dynamicButton = document.createElement("button");
					dynamicButton.type = "button";
					dynamicButton.className = `btn ${
						clickedStaff.accountStatus === "Active"
							? "btn-danger"
							: "btn-primary"
					}`;
					dynamicButton.textContent = `${
						clickedStaff.accountStatus === "Active" ? "Deactivate" : "Activate"
					}`;
					dynamicButton.id = "btnStatus"; // Add ID to the button

					const editProfileButton = document.createElement("button");
					editProfileButton.type = "button";
					editProfileButton.className = "btn btn-secondary";
					editProfileButton.textContent = "Edit Profile";
					editProfileButton.id = "btnEditProfile"; // Add ID to the button

					modalFooter.appendChild(dynamicButton);
					modalFooter.appendChild(editProfileButton);

					staffModal = new bootstrap.Modal(
						document.getElementById("staffModal")
					);
					staffModal.show();
				}
			});
		})
		.catch((error) => console.error("Error fetching staff data:", error));

	const searchInput = document.querySelector(".search-staff");
	searchInput.addEventListener("input", function () {
		const searchTerm = searchInput.value.toLowerCase();
		const staffItems = document.querySelectorAll(".staff-list-item");

		staffItems.forEach((item) => {
			const staffName = item.textContent.toLowerCase();
			if (staffName.indexOf(searchTerm) !== -1) {
				item.style.display = "block";
			} else {
				item.style.display = "none";
			}
		});
	});

	document.addEventListener("hide.bs.modal", function () {
		staffModal = null; // Reset the modal instance
	});
});
