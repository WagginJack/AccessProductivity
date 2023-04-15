chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      email: chrome.identity.email,
    });
  });

