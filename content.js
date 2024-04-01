//this file interacts with the DOM of the page
function insertBanner() {
  var bannerHtml = `<div id="my-custom-banner">
   <img src="${chrome.runtime.getURL(
     "images/icon16.png"
   )}" alt="Icon" class="banner-icon">
        <span><strong>17 of 32 keywords</strong> are present in your resume</span>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <span class="resume-match">53% resume match</span>
        <button class="close-btn">×</button>
      </div>`; // Your banner HTML code here
  var targetDiv = document.querySelector(
    "div.style__application-flow-new___JIHOx"
  );

  const button = document.createElement('button');
  button.className = 'take-test-button';
  button.textContent = 'Take Test';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '1000';

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "openTestWindow"});
});



  if (targetDiv) {
    targetDiv.insertAdjacentHTML("afterend", bannerHtml);
    var closeButton = document.querySelector("#my-custom-banner .close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        document.querySelector("#my-custom-banner").remove();
      });
    }
    // insert test button
    targetDiv.appendChild(button);
  } else {
    console.log("Target div still not found after DOM changes.");
  }
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
