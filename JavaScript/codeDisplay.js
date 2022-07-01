const displayTag = "code-display";
const formatTag = "code-block";
const languageAttribute = "code-lang";
const labelAttrubute = "code-label";
const resultsClass = "results-display";

const ariaRoleDiscrition = "Code preview";
const codeLabel = "Code:";
const displayLabel = "Result:";

customElements.define(
  displayTag,
  class extends HTMLElement {
    constructor() {
      super();
      let html = this.innerHTML;
      this.innerHTML = "";
      this.ariaRoleDescription = ariaRoleDiscrition;

      let escaped = EscapeTags(html);
      let language = this.getAttribute(languageAttribute);
      let label = this.getAttribute(labelAttrubute);
      if (label == null || typeof label == "undefined") {
        label = codeLabel;
      }
      if (language == null) {
        language = "language-HTML";
      }
      this.appendChild(MakeCodeSegment(escaped, language, label));
      this.appendChild(MakeResultsDisplay(html));
    }
  }
);
customElements.define(
  formatTag,
  class extends HTMLElement {
    constructor() {
      super();
      let html = this.innerHTML;
      this.innerHTML = "";
      this.ariaRoleDescription = ariaRoleDiscrition;

      let escaped = EscapeTags(html);
      let language = this.getAttribute(languageAttribute);
      if (typeof labelAttrubute == "undefined") {
        language = "language-HTML";
      }
      let label = this.getAttribute(labelAttrubute);
      if (label == null || typeof label == "undefined") {
        label = codeLabel;
      }
      this.appendChild(MakeCodeSegment(escaped, language, label));
    }
  }
);

function EscapeTags(html) {
  html = html.replaceAll("<", "&lt;");
  html = html.replaceAll(">", "&gt;");
  return html;
}

function MakeCodeSegment(escapedCode, language, label) {
  let pre = document.createElement("pre");
  let code = document.createElement("code");

  code.innerHTML = escapedCode;
  code.classList.add(language);
  pre.classList.add(language);

  pre.appendChild(MakeLabel(label));
  Prism.highlightElement(code);
  pre.appendChild(code);

  return pre;
}

function MakeResultsDisplay(html) {
  let article = document.createElement("article");
  article.classList.add(resultsClass);
  article.appendChild(MakeLabel(displayLabel));
  article.innerHTML += html;
  return article;
}

function MakeLabel(msg) {
  let label = document.createElement("label");
  label.innerHTML = msg;
  return label;
}
