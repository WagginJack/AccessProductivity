const add_header_button = document.getElementById('header_button');



add_header_button.addEventListener('click', ()=>{

    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {command: "add"}, (response)=>console.log(response));
    })

});