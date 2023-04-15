const add_header_button = document.getElementById('header_button');

let haveHeaders = false;

add_header_button.addEventListener('click', ()=>{
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: haveHeaders ? "remove" : "add" }, (response)=>console.log(response));
        haveHeaders = !haveHeaders;
        add_header_button.textContent = haveHeaders ? 'Remove Headers' : 'Add Headers';
    })
    
});