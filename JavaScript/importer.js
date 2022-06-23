// NB: This script must be deffereed in ordered to work.
//#region Template Creation
// constants
const ignoreClass = "not-automated"; // this class must be added to a template for it not to be automatically created

document.onload += function () {};

MakeAllTemplates();
LoadExtenralTemplateHrefs();
console.log("noni");

// ===============================================================
// Load any specified custom templates
function LoadExtenralTemplateHrefs() {
  if (typeof templateHrefs !== "undefined") {
    templateHrefs.forEach((href) => {
      LoadCustomTemplates(href);
    });
  }
}
// ===============================================================
// Making temaplates
function MakeAllTemplates() {
  let templates = document.getElementsByTagName("template");
  Array.from(templates).forEach((template) => {
    let templateId = template.id;
    // make a class if template should not be automated
    if (!template.classList.contains(ignoreClass)) {
      if (template.classList.contains(lightClass)) {
        MakeAllTemplates(templateId);
      } else {
        MakeShadowTemplate(templateId);
      }
    }
  });
}

function MakeShadowTemplate(templateName) {
  customElements.define(
    templateName,
    class extends HTMLElement {
      constructor() {
        super();
        let template = document.getElementById(templateName);
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
  );
}

// Less powerful than shadow template - no automatic updatatng, slots or dark magic
// Read by web crawlers
// Main doccument css applied
function MakeLightTemplate(templateName) {
  customElements.define(
    templateName,
    class extends HTMLElement {
      constructor() {
        super();
        let template = document.getElementById(templateName);
        let templateContent = template.content;
        this.appendChild(templateContent.firstElementChild.cloneNode(true));
      }
    }
  );
}

// Requires loadContent.js
async function LoadCustomTemplates(href) {
  let rootHref = GetRootPath(href);
  LoadHtml(href).then((doc) => {
    return MakeLoadedTemplates(doc.body);
  });
}

function ParseToHTML(text) {
  let parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}
function MakeLoadedTemplates(body) {
  let temps = body.querySelectorAll("template");
  Array.from(temps).forEach((template) => {
    document.body.appendChild(template);
    FixHrefs(template.content);
    FixSrcs(template.content);
    MakeShadowTemplate(template.id);
  });
}
//#endregion
//#region LoadContent.Js
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
async function LoadHtml(path) {
  return new Promise((resolve) => {
    fetch(path)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        let parser = new DOMParser();
        return parser.parseFromString(text, "text/html");
      })
      .then((dom) => resolve(dom));
  });
}
// Async funtions
async function LoadContent(path, element) {
  LoadHtml(path)
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

// A hacky work around to link pages in different directories from loaded content - regradless of where said content is loaded
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

//#endregion
