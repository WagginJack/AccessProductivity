
const wantsHeadersButton = document.getElementById('wantsHeaders');
const wantsCaptionsButton = document.getElementById('wantsCaptions');
const submitButton = document.getElementById('submitButton');

let userEmail;
chrome.runtime.sendMessage({type: "getProfileUserInfo"}, function(response) {
  console.log(response.email);
  userEmail = response.email
});


function initialApply(){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: pref.wantsHeaders ? "add" : "remove" }, (response)=>console.log(response));
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: pref.wantsCaptions ? "describe" : "undescribe" }, (response)=>console.log(response));
    });
}

function updateAll(){
    wantsHeadersButton.setAttribute('checked', pref.wantsHeaders);
    wantsCaptionsButton.setAttribute('checked', pref.wantsCaptions);
}
let pref = {
    wantsHeaders: true,
    wantsCaptions: true,
    wantsEmailGen: true
};
const url = '';
const fetchOptions = '';
fetch(`http://localhost:5050/users/${userEmail}/`, {method: 'GET'})
.then((result)=>{
  return result.json();
}).then((data)=>{
    pref.wantsCaptions = data.wantsCaptions;
    pref.wantsHeaders = data.wantsHeaders;
    console.log('got this from backend: ', data);
    updateAll();
    initialApply();
});


wantsHeadersButton.addEventListener('change', ()=>{
    pref.wantsHeaders = !wantsHeadersButton.checked;
});

wantsCaptionsButton.addEventListener('change', ()=>{
    pref.wantsCaptions = !wantsCaptionsButton.checked;
})

submitButton.addEventListener('click', ()=>{
    pref.wantsHeaders = wantsHeadersButton.checked;
    pref.wantsCaptions = wantsCaptionsButton.checked;
    fetch('http://localhost:5050/users/profile/', {method: 'POST',  headers: new Headers({
        "Content-Type": "application/json",
    }), body:JSON.stringify({
        email: userEmail,
        wantsCaptions: wantsCaptionsButton.checked ? true : false,
        wantsHeaders: wantsHeadersButton.checked? true : false,
    })}).then(()=>initialApply())
    ;

})