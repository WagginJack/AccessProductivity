

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getAuthToken") {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        sendResponse({token: token});
        console.log('hello')
      });
      return true;
    }
    if (request.type === "getProfileUserInfo"){
        chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
            sendResponse({email: info.email});
        });
        return true;
    }
  });
  