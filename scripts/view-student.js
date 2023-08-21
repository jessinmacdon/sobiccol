document.addEventListener("DOMContentLoaded", function () {
  const studentIdParam = new URLSearchParams(window.location.search).get("id");
  const studentInfoContainer = document.querySelector(".student-info");

  if (studentIdParam) {
    fetch("mockData/students.json")
      .then((response) => response.json())
      .then((data) => {
        const student = data.students.find((s) => s.id === studentIdParam);

        if (student) {
          const studentNameElement = document.querySelector(".student-name");
          const remarksList = document.querySelector(".remarks-list");

          studentNameElement.textContent = `${student.first_name} ${student.last_name}`;

          studentInfoContainer.innerHTML = `
            <div class="student-details">
              <div class="student-image">
                <img src="${student.student_image}" alt="Student Image" />
              </div>
              <div class="student-info">
                <h4>${student.first_name} ${student.last_name}</h4>
                <p><strong>Student ID:</strong> ${student.id}</p>
                <p><strong>Branch:</strong> ${student.branch}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Date of Birth:</strong> ${student.date_of_birth}</p>
                <p><strong>Parent/Guardian:</strong> ${student.parent_guardian}</p>
                <p><strong>Enrolment Date:</strong> ${student.enrolment_date}</p>
              </div>
            </div>
          `;

          student.remarks.forEach((remark) => {
            const remarkItem = document.createElement("li");
            remarkItem.innerHTML = `
              <span>${new Date(remark.date).toLocaleDateString()}</span>
              <p>${remark.text}</p>
            `;
            remarksList.appendChild(remarkItem);
          });

          const addRemarkBtn = document.querySelector(".update-field");
          const remarksTextarea = document.getElementById("remarks");

          addRemarkBtn.addEventListener("click", function (event) {
            event.preventDefault();
            const newRemark = remarksTextarea.value.trim();

            if (newRemark !== "") {
              const newRemarkItem = document.createElement("li");
              const currentDate = new Date().toISOString();

              newRemarkItem.innerHTML = `
                <span>${new Date(currentDate).toLocaleDateString()}</span>
                <p>${newRemark}</p>
              `;

              remarksList.appendChild(newRemarkItem);

              student.remarks.push({
                date: currentDate,
                text: newRemark,
              });

              // You can add code here to update the JSON file with the new remark

              remarksTextarea.value = "";
            }
          });
        } else {
          studentInfoContainer.innerHTML = `<p>Student not found.</p>`;
        }
      })
      .catch((error) => console.error("Error fetching student data:", error));
  } else {
    studentInfoContainer.innerHTML = `<p>No student ID provided.</p>`;
  }
});
