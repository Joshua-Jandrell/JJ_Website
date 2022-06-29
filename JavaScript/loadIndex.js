// Ths script mus be ferrederd and only called after importer.js has been loaded
const indexTemplateId = "index-entry-template";
const temaplatePath = "/Templates/ContentMenuWrapper/menuWrapper.html";
// Template detilis
const templateId = "log-item-template";
const externalAttribute = "offpage-href";
let loaded = false;
let currentPageDetails;
const openClass = "open";
// Button clsses
const nextButtonClass = "next-button";
const prevButtonClass = "prev-button";

// Called when a new Page is intialised
function OnInit(pageName, hash) {
  autoTager.Claer();

  if (!loaded) {
    let tempateHref = GetRootPath(temaplatePath);
    LoadCustomTemplates(tempateHref).then((response) => {
      loaded = true;
      MakePageList(pageName, hash);
    });
  } else {
    MakePageList(pageName, hash);
  }
}

// spcial classes
class PageDetails {
  constructor(pageName, rootPath, hrefList, isSingle = false) {
    this.pageName = pageName;
    this.rootPath = rootPath;
    this.mainListId = "content-list";
    this.mainListElem;
    this.navId = "index-list";
    this.navElem = null;
    this.hrefList = hrefList;
    this.isSingle = isSingle;
    this.templateId = templateId;
    this.template = null;
  }

  GetMainListElem() {
    if (typeof this.mainListElem === "undefined" || this.mainListElem == null) {
      this.mainListElem = document.getElementById(this.mainListId);
    }
    return this.mainListElem;
  }

  GetIndexListElem() {
    if (this.navElem == null) {
      this.navElem = document.getElementById(this.navId);
    }
    return this.navElem;
  }

  GetMainTemplate() {
    if (this.template == null) {
      this.template = document.getElementById(this.templateId);
    }
    console.log("should have templat" + this.templateId);
    console.log(this.template);
    return this.template;
  }

  CopyMainTemplate() {
    return this.GetMainTemplate().content.firstElementChild.cloneNode(true);
  }

  Claer() {
    this.mainListElem = null;
    this.navElem = null;
    this.template = null;
  }
}
const loadedArticles = {};
const pageLists = {
  "devlog.html": new PageDetails(
    "devlog",
    ".",
    [
      "/HTML/Articles/Dev/dev_s3-2_rs.html",
      "/HTML/Articles/Dev/dev_s3-1_ap.html",
      "/HTML/Articles/Dev/dev_s3-0_nb.html",
      // -- old ---
      "/HTML/Articles/Dev/dev_s2-fin_aMess.html",
      //"./Pages/Dev-log/Articles/cssHeaddings.html", // put more entries in here => Update still needed
      "/HTML/Articles/Dev/dev_s2-5_ai.html",
      "/HTML/Articles/Dev/dev_s2-4_lc.html",
      "/HTML/Articles/Dev/dev_s2-3_shadow.html",
      "/HTML/Articles/Dev/dev_s2-2_tt.html",
      "/HTML/Articles/Dev/dev_s2-1_fd.html",
      "/HTML/Articles/Dev/dev_s2-0_arb.html",
      "/HTML/Articles/Dev/dev_s1-12_rrrb.html",
      "/HTML/Articles/Dev/dev_s1-11_bb.html",
      "/HTML/Articles/Dev/dev_s1-10_psb.html",
      "/HTML/Articles/Dev/dev_s1-9_s0.html",
      "/HTML/Articles/Dev/dev_s1-8_cw0.html",
      "/HTML/Articles/Dev/dev_s1-7_dw0.html",
      "/HTML/Articles/Dev/dev_s1-6_bw0.html",
      "/HTML/Articles/Dev/dev_s1-5_gp0.html",
      "/HTML/Articles/Dev/dev_s1-4_gw0.html",
      "/HTML/Articles/Dev/dev_s1-3_ab0.html",
      "/HTML/Articles/Dev/dev_s1-2_hn0.html",
      "/HTML/Articles/Dev/dev_s1-1_lohp.html",
      "/HTML/Articles/Dev/dev_s1-0_wit.html",
    ],
    false
  ),
  "blog.html": new PageDetails(
    "blog",
    ".",
    [
      "/HTML/Articles/Blog/blog_s1-7_mm.html",
      "/HTML/Articles/Blog/blog_s1-6_uxi.html",
      "/HTML/Articles/Blog/blog_s1-5_infgeo.html",
      "/HTML/Articles/Blog/blog_s1-4_re0.html",
      "/HTML/Articles/Blog/blog_s1-3_met.html",
      "/HTML/Articles/Blog/blog_s1-2_sm.html",
      "/HTML/Articles/Blog/blog_s1-1_atmt.html",
    ],
    false
  ),
};

class NavAutoTager {
  constructor(prefix) {
    this.prefix = prefix;
    this.index = 0;
    this.navElems = {};
    this.navAnchors = {};
    this.navTags = [];
    this.currElem = null;
  }
  // Setup
  SetAutoTag(element, navIndex) {
    let tag = this.prefix + this.index.toString();
    this.SetTag(element, tag, navIndex);
    this.index++;
  }
  SetTag(element, tag, navIndex) {
    element.id = tag;
    this.navTags[navIndex] = tag;
    this.navElems[tag] = new LocalNavElem(element);
    return tag;
  }
  SetIndexHref(indexElem, tag) {
    let anchor = indexElem.querySelector("a");
    anchor.href = "#" + tag;
    // Wierd I know but this is to appease swup
    this.navAnchors[tag] = anchor;
  }

  Claer() {
    this.index = 0;
    this.navElems = {};
    this.navTags = [];
  }

  TryTag(element, tagElement, navIndex) {
    if (tagElement == null) {
      return this.SetAutoTag(element, navIndex);
    } else {
      return this.SetTag(element, tagElement.innerHTML, navIndex);
    }
  }
  //===============================================================
  // Public
  Open(id) {
    this.CloseCurrent();
    let newElem = this.GetNavElem(id);
    if (newElem == null) {
      console.warn("Attenpted to navigate to null element");
      return;
    }
    newElem.Open();
    this.currElem = newElem;
  }
  Goto(id) {
    this.CloseCurrent();
    if (id == null) {
      return;
    }
    this.navAnchors[id].click();
  }
  GotoNext(id) {
    this.Goto(this.GetNextElem(id));
  }
  GotoPrev(id) {
    this.Goto(this.GetPrevId(id));
  }
  //===============================================================
  // other utils
  SetCurrent(id) {
    this.Goto(id);
  }
  CloseCurrent() {
    if (this.currElem != null) {
      this.currElem.Close();
    }
  }
  GetNavElem(tag) {
    return this.navElems[tag];
  }
  GetPrevId(tag) {
    let tagIndex = this.navTags.indexOf(tag) + 1;

    if (tagIndex < this.navTags.length) {
      return this.navTags[tagIndex];
    } else {
      return null;
    }
  }

  GetNextElem(tag) {
    let tagIndex = this.navTags.indexOf(tag) - 1;
    if (tagIndex >= 0) {
      return this.navTags[tagIndex];
    } else {
      return null;
    }
  }
}

// constant class instances
const autoTager = new NavAutoTager("index_");

class LocalNavElem {
  constructor(element) {
    this.element = element;
    this.shadow = element.shadowRoot;
    this.details = this.shadow.querySelector("details");
    this.details.addEventListener("click", this.Click);
    this.details.setAttribute("nav-id", element.id);
  }

  Click() {
    // NB: open atribute only added after click
    if (!this.hasAttribute("open")) {
      this.classList.add(openClass);
      //autoTager.SetCurrent(this.getAttribute("nav-id"));
    } else {
      this.classList.remove(openClass);
    }
  }
  Open() {
    this.details.setAttribute("open", "true");
    this.details.classList.add(openClass);
  }
  Close() {
    this.details.removeAttribute("open");
    this.details.classList.remove(openClass);
  }
}

// Accesing possibly loaded docuemnts and prevously refferanced items
async function GetDocument(href) {
  let path = GetRootPath(href);
  return new Promise((resolve) => {
    if (path in loadedArticles) {
      resolve(loadedArticles[path]);
    } else {
      LoadHtml(path).then((html) => {
        loadedArticles[path] = html;
        resolve(html);
      });
    }
  });
}

function GetIndexTemplate() {
  if (typeof indexTemplateElem === "undefined" || indexTemplateElem == null) {
    var indexTemplateElem = document.getElementById(indexTemplateId);
  }
  return indexTemplateElem;
}
function CopyIndexTemplateElem() {
  return GetIndexTemplate().content.firstElementChild.cloneNode(true);
}

// =============================
// Mehtod to load in content
// Method to be called on load
function MakePageList(pageName, hash) {
  if (pageName in pageLists) {
    MakePage(pageLists[pageName], hash);
  } else {
    console.warn("Page name " + pageName + " is not defined");
  }
}

function MakePage(pageDetails, hash) {
  if (pageDetails.isSingle) {
    console.log("Single page");
  } else {
    MakeIndex(pageDetails, hash);
  }
}
// =============================

// index setup methods
function MakeIndex(pageDetails, hash) {
  currentPageDetails = pageDetails;
  pageDetails.Claer();
  console.log(pageDetails.GetMainTemplate());
  let externalRoot = pageDetails
    .GetMainTemplate()
    .getAttribute(externalAttribute);
  let i = 0;
  pageDetails.hrefList.forEach((href) => {
    let indexElement = MakeIndexEntry(pageDetails);
    let navIndex = i;
    i++;
    LaodEntry(pageDetails, href).then((mainElem) => {
      if (externalRoot == null || externalRoot == "") {
        DoInternalNavSetup(mainElem, indexElement, navIndex);
      } else {
        console.log("EXTERAN");
        DoExternalNavSetup(
          mainElem,
          indexElement,
          navIndex,
          externalRoot,
          href
        );
      }
    });
  });

  async function DoInternalNavSetup(mainElem, indexElement, navIndex) {
    SetInternalNav(mainElem, indexElement, navIndex);
    SetButtons(mainElem);
    if ("#" + mainElem.id == hash) {
      autoTager.Goto(mainElem.id);
    }
  }

  async function DoExternalNavSetup(
    mainElem,
    indexElem,
    navIndex,
    externalRoot,
    articlaHref
  ) {
    let href = externalRoot + "#" + articlaHref;
    mainElem.shadowRoot.querySelector("a").href = href;
    indexElem.querySelector("a").href = href;
    SetIndexName(indexElem, mainElem);
  }

  async function LaodEntry(pageDetails, href) {
    let mainEntryWrapper = MakeMainEntryWrapper(pageDetails);
    let loadSocket = mainEntryWrapper.querySelector("load-socket");
    return new Promise((resolve) => {
      GetDocument(href).then((doc) => {
        let article = PutDocIntoDOMElement(doc, loadSocket);
        resolve(article);
      });
    });
  }

  function MakeMainEntryWrapper(pageDetails) {
    let parentElem = pageDetails.GetMainListElem();
    let templateCopy = pageDetails.CopyMainTemplate();
    parentElem.appendChild(templateCopy);
    return templateCopy;
  }

  function MakeIndexEntry(pageDetails) {
    let parentElem = pageDetails.GetIndexListElem();
    let templateCopy = CopyIndexTemplateElem();
    return parentElem.appendChild(templateCopy);
  }

  // ---- Internal
  function SetInternalNav(mainEntry, indexElem, index) {
    let entryTag = mainEntry.getElementsByClassName("nav-tag")[0];
    let navTag = autoTager.TryTag(mainEntry, entryTag, index);
    SetIndexName(indexElem, mainEntry);
    autoTager.SetIndexHref(indexElem, navTag);
    return navTag;
  }

  function SetIndexName(indexElem, mainEntry) {
    entryName = mainEntry.getElementsByClassName("p-name")[0].innerHTML;
    let indexName = indexElem.getElementsByClassName("p-name")[0];
    indexName.innerHTML = entryName;
    return entryName;
  }
}
//----- External
//function SetExternalLink()

//=========================== Nv
// Nav setup
function SetButtons(element) {
  let buttons = element.shadowRoot.querySelectorAll("button");
  Array.from(buttons).forEach((button) => {
    if (button.classList.contains(prevButtonClass)) {
      SetPrevButton(button, element);
    } else if (button.classList.contains(nextButtonClass)) {
      SetNextButton(button, element);
    }
  });
}

function SetPrevButton(button, element) {
  let id = element.id;
  button.addEventListener("click", (e) => {
    autoTager.GotoPrev(id);
  });
}
function SetNextButton(button, element) {
  button.addEventListener("click", (e) => {
    autoTager.GotoNext(element.id);
  });
}
