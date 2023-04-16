function insertHeaders(paragraphElements, gptResponse) {
  const resposeWithBodyHtml = `<html><body>${gptResponse}</body></html>`
  const resposeParsedDOM = (new DOMParser()).parseFromString(resposeWithBodyHtml, 'text/html');
  const allChildrenOfBody = Array.prototype.slice.call(resposeParsedDOM.body.childNodes);
  let originalParagraphsIndex = 0;
  let responseNodesIndex = 0;
  let lastHeader = undefined;
  while (originalParagraphsIndex < paragraphElements.length){
      if (allChildrenOfBody[responseNodesIndex].tagName === 'H3'){
          lastHeader = allChildrenOfBody[responseNodesIndex]
      } else if (allChildrenOfBody[responseNodesIndex].tagName === 'P'){
          if (lastHeader !== undefined) {
              paragraphElements[originalParagraphsIndex].insertAdjacentElement('beforebegin', lastHeader);
          }
          originalParagraphsIndex++;
          lastHeader = undefined;
      } else {
          console.log('invalid tag name found: ', allChildrenOfBody[responseNodesIndex].tagName);
      }
      responseNodesIndex++;
  }
  return undefined;
}

const chatGPTQuestion = "Can you insert <h3> elements for <p> paragraph elements in the above html doc such that the <h3> header elements improve the understanding of the paragraph elements? Do not alter or delete the <p> elements. Add infrequent headers on paragraphs that have similar topics with a <h3> tag. If you add a header, make sure there is 3 paragraphs after it";
var fetchOptions = {
  method: "POST",
  headers: new Headers({
      "Content-Type": "application/json",
  }),
}

const url = "http://localhost:5050/users";
let userData = {};


chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if (request.command === 'add'){
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
        userData.email = userEmail;

        fetchOptions.body = JSON.stringify(userData);
        fetch(url, fetchOptions)
        .then((result)=>{
          return result.json();
        }).then((data)=>{
          console.log(data);
          insertHeaders(p_elements_in_article, data);
        });
      } else if (request.command === 'remove'){
      const accessProductivityHeaders = document.getElementsByClassName('accessproductivityheader') ;
      const header_elements = Array.prototype.slice.call(accessProductivityHeaders);
      header_elements.forEach((element)=>{
        element.remove();
      });
    }
    else if (request.command === 'Describe'){
      sendResponse({result: "success"});
      // Find all image elements on the current webpage
      const images = document.getElementsByTagName("img");
      console.log("grabbing images")
      let isValid = [];
      for(let i = 0; i< images.length;i++){
      userData.img =  images[i].src;
      isValid[i] = (!(images[i].src.includes(".svg")) || (images[i].alt == ""));
      console.log(isValid[i]);
      if(isValid[i]==1){
      console.log(userData.img);
      fetchOptions.body = JSON.stringify(userData);
      fetch("http://localhost:5050/users/caption/", fetchOptions)
      .then((result)=>{
        return result.json();
      }).then((data)=>{
        console.log(data);
        images[i].alt = data;
        //insertHeaders(p_elements_in_article, data);
      });}
     }console.log("done alt texting all images")
    } else if (request.command === 'Remove'){
      console.log("removing all alt tags")
      const images = document.getElementsByTagName("img");

      // Loop through each image element and get its source URL
      for (let i = 0; i < images.length; i++) {
      images[i].alt = "";
      }
  }
});

function getAllParagraphStrings(paragraphElementList){
  return `<p>${paragraphElementList.map((p_element)=>p_element.innerText).join('</p><p>')}</p>\n\n\n\n${chatGPTQuestion}`;
}


let userEmail;
chrome.runtime.sendMessage({type: "getProfileUserInfo"}, function(response) {
  console.log(response.email);
  userEmail = response.email
});

