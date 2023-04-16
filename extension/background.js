

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getAuthToken") {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        sendResponse({token: token});
      });
      return true;
    }
  });
  