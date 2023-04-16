export function insertHeaders(paragraphElements, gptResponse) {
    const resposeWithBodyHtml = `<html><body>${gptResponse}</body></html>`
    const resposeParsedDOM = (new DOMParser()).parseFromString(resposeWithBodyHtml, 'text/html');
    const allChildrenOfBody = Array.prototype.slice.call(resposeParsedDOM.body.childNodes);
    let originalParagraphsIndex = 0;
    let responseNodesIndex = 0;
    let lastHeader = undefined;
    while (originalParagraphsIndex < paragraphElements.length){
        if (allChildrenOfBody[responseNodesIndex].tagName === 'H1'){
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
const testHTML = '<html><body><p style="color: red;">test1</p><p>test2</p><p style="color: blue;">test3</p></body></html>';
const testDOM = (new DOMParser()).parseFromString(testHTML, 'text/html');
const testParagraphNodes = Array.prototype.slice.call(testDOM.getElementsByTagName('p'));
console.log(testDOM.body.childNodes);
insertHeaders(testParagraphNodes, '<h1>Header 1</h1><p>test1</p><h1>Header 10</h1><p>test2</p><p>test3</p>');
console.log(testDOM.body.childNodes);
newChildren = Array.prototype.slice.call(testDOM.body.childNodes);
for (let counter = 0; counter < newChildren.length; counter++){
    const root = document.getElementById('root');
    root.appendChild(newChildren[counter]);
}