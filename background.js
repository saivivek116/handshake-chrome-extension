chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle the 'openTestWindow' action
  if (message.action === "openTestWindow") {
    chrome.windows.create({
      url: "test.html", // Ensure this is the correct path to your HTML file
      type: "popup", // 'panel' type might not be supported in all Chrome versions
      // Optional dimensions
      width: 800,
      height: 600,
    });
  }

  // Handle the 'openAnswerWindow' action
  if (message.action === "openAnswerWindow") {
    const url =
      chrome.runtime.getURL("answer_display.html") +
      `?question=${encodeURIComponent(message.question)}`;
    chrome.windows.create({
      url: url,
      type: "popup",
      width: 800,
      height: 600,
    });
  }
});
