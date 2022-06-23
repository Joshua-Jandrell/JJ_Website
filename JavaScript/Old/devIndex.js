// NB - this script only works if other required scripts are loaded into the dcument
// These include:
// => and varable pathToRoot containing a part to the root of the site (and wierd work aroud required to use JS pages)
// => loadContent.js
// => template.js + a desingated 'log-entry' template
// => udpatedBySection.js *not required for running but imporves funtionality
// Ideally this script should execute BEFORE loadContent.js to avoid any possible issues - however order shouldn't really matter

// constants
const templateNameClass = "p-name";
const templateLinkClass = "blog-nav";

const docIndexId = "log-index";
const templateId = "index-entry-template";
const articleHrefTag = "article-href";

const closeButtonClass = "close-button";
const openNextClass = "next-button";
const openPreButtonClass = "prev-button";
const indexElemIds = [];

const devIndexType = "dev";
const blogIndexType = "blog";
const devIndexHiddenClass = "noDisplay";

const importedTemplateName = "log-template";

let customIdCounter = 0;
const customIdPrefex = "auto-index";

// ===============================================================
// Setup events
function AddOnLoad(
  className,
  indexType,
  templateName = importedTemplateName,
  loadElement = "import-html"
) {
  let elemArray = Array.from(document.getElementsByClassName(className));
  elemArray.forEach((element) => {
    let elemId = FindElemId(element);
    indexElemIds.push(elemId);
    let indexElem = MakeIndexEntry();
    let importer = element.getElementsByTagName(loadElement)[0];
    importer.addEventListener("html-imported", (e) => {
      DoIndexSetup(e.detail.elem, elemId, indexElem, indexType, templateName);
    });
  });
}
// ===============================================================
// Setup funtions
function DoIndexSetup(loadedElem, targetId, indexElem, indexType, tempName) {
  if (indexType == devIndexType) {
    SetupDevIndex(indexElem, loadedElem, targetId, tempName);
  } else if (indexType == blogIndexType) {
    SetUpBlogIndex(indexElem, loadedElem, targetId, tempName);
  } else {
    console.log("Unknow index type: " + indexType);
  }
}
function SetupDevIndex(newEntry, loadedElem, targetId, tempName) {
  // set up and index where all items are in the same doc containe d by detail/summaery elements
  SetClassContent(newEntry, loadedElem, templateNameClass);
  SetIndexLink(newEntry, templateLinkClass, targetId, tempName);
  SetLinkedId(newEntry, targetId);
  CheckLinkLocation(targetId, tempName);
}
function SetUpBlogIndex(indexElem, loadedElem, loadTargetId, tempName) {
  let hrefTxt = GetPathToRoot() + GetHrefTextFromLoadData(loadedElem);
  SetExternalHref(indexElem, hrefTxt);
  SetExternalHref(GetImportedTemplateShadow(loadTargetId, tempName), hrefTxt);
  SetClassContent(indexElem, loadedElem, templateNameClass);
}
// ===============================================================
// General Setup
function SetExternalHref(indexElem, href) {
  let a;
  a = indexElem.querySelectorAll("a")[0];

  a.href = href;
}
function MakeIndexEntry() {
  let template = document.getElementById(templateId);
  let newEntry = template.content.firstElementChild.cloneNode(true);
  let navContainer = document.getElementById(docIndexId);
  navContainer.appendChild(newEntry);
  return newEntry;
}
function SetClassContent(newEntry, loadedElem, className) {
  let loadElem = loadedElem.getElementsByClassName(className)[0];
  let newElem = newEntry.getElementsByClassName(className)[0];
  if (loadElem != null && newElem != null) {
    newElem.innerHTML = loadElem.innerHTML;
  }
}
function SetIndexLink(newEntry, linkClass, targetId, tempName) {
  links = newEntry.getElementsByTagName("a");
  Array.from(links).forEach((a) => {
    if (a.classList.contains(linkClass)) {
      SetAnchorRef(a, targetId);
      AddOpenDetailsOnCLick(a, targetId, tempName);
      return;
    }
  });
}
// ===============================================================
// Href and id managamnent
function MakeIdHrefTxt(targetId) {
  return "#" + targetId;
}
function SetAnchorRef(a, targetId) {
  let hrefTxt = MakeIdHrefTxt(targetId);
  a.href = hrefTxt;
}
function SetLinkedId(navElem, targetId) {
  // check to see if a marker linking funtion exisits.
  if (typeof (GetMarkerNavId === "function")) {
    let elemId = GetMarkerNavId(targetId);
    navElem.id = elemId;
  }
  // if not, there is no point in setting a linked ID
}
function GetHrefTextFromLoadData(loadData) {
  return loadData.querySelectorAll(articleHrefTag)[0].innerHTML;
}

function FindElemId(elem) {
  if (elem.id == "") {
    elem.id = MakeCustomIndex();
  }
  return elem.id;
}
function MakeCustomIndex() {
  let custom = customIdPrefex + String(customIdCounter);
  customIdCounter++;
  return custom;
}
// ===============================================================
// Open/close details on click
function AddOpenDetailsOnCLick(a, targetId, tempName) {
  let shadow = GetImportedTemplateShadow(targetId, tempName);
  let details = shadow.querySelectorAll("details")[0];
  a.addEventListener("click", (e) => OpenDetails(details));
  let closeButtons = shadow.querySelectorAll("button");
  SubscribeToCloseButtons(closeButtons, details, targetId, tempName);
}
function SubscribeToCloseButtons(closeButtons, details, targetId, tempName) {
  Array.from(closeButtons).forEach((button) => {
    if (button.classList.contains(closeButtonClass)) {
      button.addEventListener("click", (e) => {
        CloseDetails(details);
        DoAttionalButtonActions(button, targetId, tempName);
      });
    }
  });
}
function DoAttionalButtonActions(button, targetId, tempName) {
  if (button.classList.contains(openNextClass)) {
    SetNextButton(targetId, tempName);
  } else if (button.classList.contains(openPreButtonClass)) {
    SetPrevButton(targetId, tempName);
  } else {
    GotoElemId(targetId);
  }
}
function SetNextButton(targetId, tempName) {
  let newId = GetIndexAbove(targetId);
  if (newId != null) {
    OpenLogEntry(newId, tempName);
  } else {
    GotoElemId(targetId);
  }
}
function SetPrevButton(targetId, tempName) {
  let newId = GetIndexBelow(targetId);
  if (newId != null) {
    OpenLogEntry(newId, tempName);
  } else {
    GotoElemId(targetId);
  }
}
function OpenLogEntry(id, tempName) {
  GotoElemId(id);
  let newShadow = GetImportedTemplateShadow(id, tempName);
  OpenDetails(newShadow.querySelectorAll("details")[0]);
}
function GotoElemId(id) {
  window.location = MakeIdHrefTxt(id);
}
function OpenDetails(details) {
  details.setAttribute("open", "true");
}
function CloseDetails(details) {
  details.removeAttribute("open");
}
function GetImportedTemplateShadow(id, tempName) {
  let target = document.getElementById(id);
  let logEntry = target.getElementsByTagName(tempName)[0];
  return logEntry.shadowRoot;
}
// opens the log item if there is a '#' in the hyperlink
function CheckLinkLocation(id, tempName) {
  if (window.location.hash === MakeIdHrefTxt(id)) {
    OpenLogEntry(id, tempName);
  }
}

function GetIndexAbove(id) {
  let prevId = null;
  let set = false;
  indexElemIds.forEach((indexId) => {
    set = indexId == id || set;
    if (!set) {
      prevId = indexId;
    }
  });
  return prevId;
}
function GetIndexBelow(id) {
  let lowerId = null;
  let found = false;
  indexElemIds.forEach((indexId) => {
    if (found) {
      // only set if the next found element exists
      lowerId = indexId;
    }
    found = indexId == id;
  });
  return lowerId;
}

function CloseCheckbox(id) {
  let indexToggle = document.getElementById(id);
  if (indexToggle != null) {
    indexToggle.checked = false;
  }
}

// ==================================== Load extern blog index
function LoadExternalBlogIndex(
  hrefList,
  nameList,
  templateId,
  parentId,
  isShadow = false,
  hostTag = ""
) {
  let parent;
  if (isShadow) {
    parent = GetShadowElem(parentId, hostTag);
  } else {
    parent = document.getElementById(parentId);
  }
  let template = document.getElementById(templateId);
  MakeExternalLinks(hrefList, nameList, template, parent);
}

function MakeExternalLinks(hrefList, nameList, template, parent) {
  let i = 0;
  hrefList.forEach((href) => {
    if (i != hrefList.length - (GetArticleNumber() + 1)) {
      MakeIndexLink(GetRootPath(href), nameList[i], template, parent);
    }
    i++;
  });
}

function MakeIndexLink(href, name, template, parent) {
  let clone = template.content.firstElementChild.cloneNode(true);

  SetElemClassContent(name, "p-name", clone);
  SetElemAnchorRef(href, clone);
  parent.appendChild(clone);
}

function GetShadowElem(id, hostTag) {
  let host = document.getElementsByTagName(hostTag)[0];
  let shadow = host.shadowRoot;
  return shadow.getElementById(id);
}
