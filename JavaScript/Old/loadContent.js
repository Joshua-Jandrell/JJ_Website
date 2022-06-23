// constants
const elementName = "import-html";
const attributeName = "href";
const nestedClass = "importTarget";
const nestedImportId = "elem-id";
const loadEventName = "html-imported";

const loadSockectName = "load-socket";

// ===============================================================
// Script run on load
document.onload += customElements.define(
  elementName,
  class extends HTMLElement {
    constructor() {
      super();
      let path = this.getAttribute(attributeName);
      LoadContent(path, this);
    }
  }
);
// ===============================================================
// general element loading funtion
async function LoadHtml(path)
{
  return new Promise((resolve)=>{
    
  })
}
// Async funtions
async function LoadContent(path, element) {
  fetch(path)
    .then((response) => {
      // When the page is loaded convert it to text
      return response.text();
    })
    .then((text) => {
      let parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    })
    .then((doc) => {
      let body = doc.body;
      FixHrefs(body);
      FixSrcs(body);
      let parent = element.parentElement;
      parent.innerHTML = body.innerHTML;
      return parent;
    })
    .then((elem) => {
      // Format any loaded code
      if (typeof FormatCode === "function") FormatCode("code-snip", elem);

      // dispatch load event
      let loadEvent = MakeLoadEvent(elem);
      element.dispatchEvent(loadEvent);
    });
}
// ===============================================================
// Events
function MakeLoadEvent(elemHTML) {
  return new CustomEvent(loadEventName, {
    detail: { elem: elemHTML },
    bubbles: true,
  });
}

// A hacky work around to let link pages in different directories from loaded content - regradless of where said content is loaded
function FixHrefs(loadedContent) {
  let hrefElems = loadedContent.querySelectorAll("[load-href]");
  Array.from(hrefElems).forEach((hrefElem) => {
    hrefElem.href = GetRootPath(hrefElem.getAttribute("load-href"));
  });
}
function FixSrcs(loadedContent) {
  let srcElems = loadedContent.querySelectorAll("[load-src]");
  Array.from(srcElems).forEach((srcElem) => {
    srcElem.src = GetRootPath(srcElem.getAttribute("load-src"));
  });
}
// ===============================================================
// Automated importing
function LoadImports(hrefList, templateId, parentId) {
  let parent = document.getElementById(parentId);
  let template = document.getElementById(templateId);
  MakeTemplates(hrefList, template, parent);
}
function MakeTemplates(hrefList, template, parent) {
  let i = 0;
  hrefList.forEach((href) => {
    // check so as not to make a link to current article in current article
    if (i != hrefList.length - (GetArticleNumber() + 1)) {
      MakeFromTemplate(GetRootPath(href), template, parent);
    }
    i++;
  });
}
function MakeFromTemplate(href, temaplate, parent) {
  let clone = temaplate.content.firstElementChild.cloneNode(true);
  let loadSocket = clone.querySelectorAll(loadSockectName)[0];
  parent.appendChild(clone);
  LoadContent(href, loadSocket);
}
