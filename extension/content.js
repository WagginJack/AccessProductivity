const newHeaderText = "Hello World";
const h3_class = "!display: block; !font-size: 1.17em; !margin-top: 1em; !margin-bottom: 1em; !margin-left: 0; !margin-right: 0; !font-weight: bold;"
const chatGPTQuestion = "Can you insert <h3> elements for <p> paragraph elements in the above html doc such that the <h3> header elements improve the understanding of the paragraph elements? Do not alter the element content.";
var fetchOptions = {
  method: "POST",
  headers: new Headers({
      "Content-Type": "application/json",
  }),
}

const url = "http://localhost:3920/postRequest";
var userData = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if (request.command === 'add'){
        //makeAsyncGPT();
        sendResponse({result: "success"});
        var paragraphs = document.getElementsByTagName('p'); // Get all paragraph tags
      var classCounts = {}; //store class name counts

      for (var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];
        var classes = paragraph.className.split(' '); // Get the class name of the paragraph

        for (var j = 0; j < classes.length; j++) {
          var className = classes[j];
          if (classCounts[className]) {
            classCounts[className]++; // Increment count if class name already exists in the object
          } else {
            classCounts[className] = 1; // Initialize count if class name does not exist in the object
          }
        }
      }

      var mostCommonClass = "";
      var maxCount = 0;

      for (var className in classCounts) {
        if (classCounts[className] > maxCount) {
          maxCount = classCounts[className]; // Update max count
          mostCommonClass = className; // Update most common class
        }
      }

      if (mostCommonClass !== "") {
        console.log('The most commonly found class in the paragraph tags of the article body is: ' + mostCommonClass);
      } else {
        console.log('No class found in the paragraph tags of the article body.');
      }
        const p_elements_in_article = Array.prototype.slice.call(document.getElementsByClassName(mostCommonClass));
        const formattedGPTQuestion = getAllParagraphStrings(p_elements_in_article);
        userData.gptQuestion = formattedGPTQuestion;
        const chromeIdentity = chrome.identity;
        //if (chromeIdentity === undefined) return;
        userData.userEmail = 'testemail';
        fetchOptions.body = JSON.stringify(userData);
        fetch(url, fetchOptions)
        .then((response)=>{
          return JSON.parse(response);
        })
        .then((result)=>{
          console.log(result);
        })/*
        chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
          userData.userEmail = info.email;
          fetchOptions.body = JSON.stringify(userData);
          fetch(url, fetchOptions)
          .then((response)=>{
            return JSON.parse(response);
          })
          .then((result)=>{
            console.log(result);
          })
        });*/
        /*
        console.log(getAllParagraphStrings(p_elements_in_article));
        p_elements_in_article.forEach((element)=>{
            const newHeader = document.createElement('h3');
            const textNode = document.createTextNode(newHeaderText);
            newHeader.setAttribute('style', h3_class);
            newHeader.setAttribute('class', 'accessproductivityheader');
            newHeader.appendChild(textNode);
            element.insertAdjacentElement('beforebegin', newHeader);
        });    */
      } else if (request.command === 'remove'){
      const accessProductivityHeaders = document.getElementsByClassName('accessproductivityheader') ;
      const header_elements = Array.prototype.slice.call(accessProductivityHeaders);
      header_elements.forEach((element)=>{
        element.remove();
      });
    }
});

function getAllParagraphStrings(paragraphElementList){
  return `<p>${paragraphElementList.map((p_element)=>p_element.innerText).join('</p><p>')}</p>\n\n\n\n${chatGPTQuestion}`;
}
