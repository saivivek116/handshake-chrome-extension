// Parse the question from URL parameters
const params = new URLSearchParams(window.location.search);
const question = params.get("question");
document.getElementById("question").textContent = question;

// Adjusting the API call to use POST method
fetch(`http://127.0.0.1:3000/job-genie`, {
  method: "POST", // Specifying the method
  headers: {
    "Content-Type": "application/json", // Indicating the content type
  },
  body: JSON.stringify({ question: question }), // Sending the question in the body
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    document.getElementById("answer").textContent = data.answer; // Assuming 'answer' is the correct property
    document.getElementById("shimmer").classList.add("hidden"); // Hide shimmer effect
    document.getElementById("content").classList.remove("hidden"); // Show content
  })
  .catch((error) => {
    console.error("Error:", error);
    // Optionally, update the UI to indicate an error occurred
  });
