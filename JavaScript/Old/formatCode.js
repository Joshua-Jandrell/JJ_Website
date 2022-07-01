const charDict = { "<": "&lt;", ">": "&gt;" };
const autoFormatTag = "auto-code";

function FormatCode(codeClass) {
  FormatAsCode(codeClass, document);
}

function FormatCode(codeClass, elem) {
  let codeSnips = elem.getElementsByClassName(codeClass);
  Array.from(codeSnips).forEach((snip) => {
    EscapeTags(snip);
  });
}

// COnvert the inner html of an element into a plain string
function EscapeTags(elem) {
  let html = elem.innerHTML;
  elem.innerHTML = FormatAsCode(html);
}

function FormatAsCode(html) {
  let htmlString = String(html);
  let pre = "";

  for (let char of htmlString) {
    if (char in charDict) {
      pre += String(charDict[char]);
    } else {
      pre += String(char);
    }
  }
  return pre;
}

customElements.define(
  displayTag,
  class extends HTMLElement {
    constructor() {
      super();
      EscapeTags(this);
    }
  }
);
