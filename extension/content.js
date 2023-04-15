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
        p_elements_in_article.forEach((element)=>{
            const newHeader = document.createElement('h1');
            const textNode = document.createTextNode("Hello World");
            newHeader.appendChild(textNode);
            element.insertAdjacentElement('beforebegin', newHeader);
        });
        console.log(p_elements_in_article);
    }
});