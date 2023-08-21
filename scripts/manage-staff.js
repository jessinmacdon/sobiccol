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
                staffListItem.dataset.staffId = staff.id;
                staffListContainer.appendChild(staffListItem);
            });

            staffListContainer.addEventListener("click", function (event) {
                const clickedStaffId = event.target.dataset.staffId;

                if (clickedStaffId) {
                    window.location.href = `view-staff.html?staffId=${clickedStaffId}`;
                }
            });

            const searchInput = document.querySelector(".search-staff");
            const errorMessage = document.querySelector(".error-message");

            searchInput.addEventListener("input", function () {
                const searchTerm = searchInput.value.toLowerCase();
                const staffItems = document.querySelectorAll(".staff-list-item");
                let found = false;

                staffItems.forEach((item) => {
                    const staffName = item.textContent.toLowerCase();
                    item.style.display = staffName.indexOf(searchTerm) !== -1 ? "block" : "none";
                    if (item.style.display === "block") {
                        found = true;
                    }
                });

                errorMessage.style.display = found ? "none" : "block";
            });
        })
        .catch((error) => console.error("Error fetching staff data:", error));
});

