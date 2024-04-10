document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:3000/get-job-matching-insights")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("content").style.display = "block";
      displayData(data);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
});

function displayData(data) {
  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = ""; // Clear existing list items
  data.SkillsNotInResume.forEach((skill) => {
    const listItem = document.createElement("li");
    listItem.textContent = skill;
    skillsList.appendChild(listItem);
  });

  document.getElementById("resume-match").textContent = `${parseInt(
    data.MatchPercentage
  )}% Resume match`;
}
