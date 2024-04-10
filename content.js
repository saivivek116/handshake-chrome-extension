// Import libraries if needed for making API calls (e.g., fetch)
// import fetch from 'node-fetch'; // This might be needed in your environment
function setupBoxClickListener() {
  const apiUrl = "http://127.0.0.1:3000/job-genie";
  const boxContainer = document.querySelector(".box-container");
  if (boxContainer) {
    boxContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("box")) {
        const clickedText = event.target.innerText;
        console.log("Box clicked:", clickedText);
        chrome.runtime.sendMessage(
          { action: "openAnswerWindow", question: clickedText },
          function (response) {
            if (chrome.runtime.lastError) {
              console.error(
                "SendMessage error:",
                chrome.runtime.lastError.message
              );
            } else {
              // Handle response here, if needed
            }
          }
        );
      }
    });
  }
}

function insertBanner() {
  // Assuming your API endpoint to process keywords is at 'https://your-api.com/process-keywords'

  var bannerHtml = `
    <div id="my-custom-banner">
      <img src="${chrome.runtime.getURL(
        "images/icon16.png"
      )}" alt="Icon" class="banner-icon">
      <span><strong>17 of 32 keywords</strong> are present in your resume</span>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <span class="resume-match">53% resume match</span>
      <button class="close-btn">×</button>
    </div>
      <div class="box-container">
        <div class="box">What are the core responsibilities of this job?</div>
        <div class="box">What is the typical career path for someone in this role?</div>
        <div class="box">What specific programming languages and technologies should a candidate be proficient in for this role?</div>
        <div class="box">Could you elaborate on the kinds of projects a Junior Software Developer would be handling initially?</div>
      </div>
  `;

  var targetDiv = document.querySelector(
    "div.style__application-flow-new___JIHOx"
  );

  const button = document.createElement("button");

  button.textContent = "Take Test";

  button.classList.add("take-test-button");
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openTestWindow" });
  });

  button.textContent = "Take Test";
  button.classList.add("take-test-button");
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openTestWindow" });
  });

  if (targetDiv) {
    targetDiv.insertAdjacentHTML("afterend", bannerHtml);
    var closeButton = document.querySelector("#my-custom-banner .close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        document.querySelector("#my-custom-banner").remove();
      });
    }
    targetDiv.appendChild(button);
  } else {
    console.log("Target div still not found after DOM changes.");
  }
  setupBoxClickListener();
}

// MutationObserver callback to execute when mutations are observed
var callback = function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === "childList") {
      var targetDiv = document.querySelector(
        "div.style__application-flow-new___JIHOx"
      );
      if (targetDiv) {
        insertBanner();
        observer.disconnect(); // Stop observing after the target div is found
        break;
      }
    }
  }
};
// Create a MutationObserver instance
var observer = new MutationObserver(callback);

// Start observing the document body for DOM mutations
observer.observe(document.body, { childList: true, subtree: true });
