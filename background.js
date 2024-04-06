chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openTestWindow") {
        chrome.windows.create({
            url: 'test.html', // URL of the test page you want to open
            type: 'normal',
            // width: 800,
            // height: 600
        });
    }
});