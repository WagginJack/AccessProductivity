const add_header_button = document.getElementById('header_button');
const add_image_button = document.getElementById('image_button');

let haveHeaders = false;
let haveImages = false;

add_image_button.addEventListener('click', ()=>{
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: haveImages ? "Remove" : "Describe" }, (response)=>console.log(response));
        haveImages = !haveImages;
        add_image_button.textContent = haveImages ? 'Remove Images' : 'Describe Images';
    })
    
});

add_header_button.addEventListener('click', ()=>{
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: haveHeaders ? "remove" : "add" }, (response)=>console.log(response));
        haveHeaders = !haveHeaders;
        add_header_button.textContent = haveHeaders ? 'Remove Headers' : 'Add Headers';
    })
    
});