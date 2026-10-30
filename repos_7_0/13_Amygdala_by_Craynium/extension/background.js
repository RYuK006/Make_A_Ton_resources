// background.js

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        const url = tabs[0].url;
        const newUrl = `https://amygdala.study/?url=${encodeURIComponent(url)}`;
        
        // Redirect to the new URL
        browser.tabs.update(tabs[0].id, { url: newUrl });
    });
});
