const wantsHeadersButton = document.getElementById('wantsHeaders');
const wantsCaptionsButton = document.getElementById('wantsCaptions');
const wantsEmailGenButton = document.getElementById('wantsEmailGen');
const submitButton = document.getElementById('submitButton');

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
    wantsEmailGenButton.setAttribute('checked', pref.wantsEmailGen);
}
let pref = {
    wantsHeaders: true,
    wantsCaptions: true,
    wantsEmailGen: true
};
const url = '';
const fetchOptions = '';
fetch('http://localhost:5050/users/ahmni.pangjohnson@gmail.com/', {method: 'GET'})
.then((result)=>{
  return result.json();
}).then((data)=>{
    pref.wantsCaptions = data.wantsCaptions;
    pref.wantsEmailGen = data.wantsEmailGen;
    pref.wantsHeaders = data.wantsHeaders;
    console.log(pref);
    updateAll();
    initialApply();
});


wantsHeadersButton.addEventListener('click', ()=>{
    pref.wantsHeaders = !pref.wantsHeaders;
});

wantsCaptionsButton.addEventListener('click', ()=>{
    pref.wantsCaptions = !pref.wantsCaptions;
})

submitButton.addEventListener('click', ()=>{
    fetch('http://localhost:5050/users/profile/', {method: 'POST', body:JSON.stringify({
        wantsCaptions: pref.wantsCaptions ? true : false,
        wantsHeaders: pref.wantsHeaders ? true : false,
        wantsEmailGen: pref.wantsCaptions ? true : false
    })}).then(()=>initialApply())
    ;
})