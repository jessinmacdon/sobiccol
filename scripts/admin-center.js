document.addEventListener("DOMContentLoaded", () => {
	const createAccountModal = new bootstrap.Modal(
		document.getElementById("createAccountModal")
	);

	const newAccountBtn = document.querySelector(".new-account-btn");
	newAccountBtn.addEventListener("click", () => {
		createAccountModal.show();
	});

	// Form Submission
	const createAccountForm = document.getElementById("createAccountForm");

	createAccountForm.addEventListener("submit", (event) => {
		event.preventDefault();
		if (createAccountForm.checkValidity()) {
			// Form data validation is successful, you can process the form data here
			console.log("Form data submitted successfully!");
			// Close the modal after successful form submission
			createAccountModal.hide();
		} else {
			createAccountForm.classList.add("was-validated");
		}
	});
});
