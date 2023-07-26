document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const loaderModal = document.getElementById("loaderModal");

  // Function to show the loader modal
  function showLoader() {
    const bsModal = new bootstrap.Modal(loaderModal);
    bsModal.show();
  }

  // Function to hide the loader modal
  function hideLoader() {
    const bsModal = bootstrap.Modal.getInstance(loaderModal);
    bsModal.hide();
  }

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
      // Show loader modal before proceeding to the next page
      showLoader();

      // Simulate a delay to demonstrate the loader (You should remove this in production)
      setTimeout(() => {
        // Hide the loader modal and redirect to index.html
        hideLoader();
        alert("Form submitted successfully. Redirecting to index.html...");
        window.location.href = "index.html"; // Redirect to index.html
      }, 2000); // Adjust the delay time as needed (in milliseconds)
    } else {
      form.classList.add("was-validated");
    }
  });
});
