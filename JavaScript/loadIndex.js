// Ths script mus be ferrederd and only called after importer.js has been loaded
const indexTemplateId = "index-entry-template";
const temaplatePath = "/Templates/ContentMenuWrapper/menuWrapper.html";
let loaded = false;

// Called when a new Page is intialised
function OnInit(pageName) {
  autoTager.Claer();

  if (!loaded) {
    LoadCustomTemplates(temaplatePath).then((response) => {
      loaded = true;
      MakePageList(pageName);
    });
  } else {
    MakePageList(pageName);
  }
}

// spcial classes
class PageDetails {
  constructor(pageName, rootPath, hrefList, templateId = "log-item-template") {
    this.pageName = pageName;
    this.rootPath = rootPath;
    this.mainListId = "content-list";
    this.mainListElem;
    this.navId = "index-list";
    this.navElem = null;
    this.hrefList = hrefList;
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
      "./HTML/Articles/Dev/dev_s2-fin_aMess.html",
      //"./Pages/Dev-log/Articles/cssHeaddings.html", // put more entries in here => Update still needed
      "./HTML/Articles/Dev/dev_s2-5_ai.html",
      "./HTML/Articles/Dev/dev_s2-4_lc.html",
      "./HTML/Articles/Dev/dev_s2-3_shadow.html",
      "./HTML/Articles/Dev/dev_s2-2_tt.html",
      "./HTML/Articles/Dev/dev_s2-1_fd.html",
      "./HTML/Articles/Dev/dev_s2-0_arb.html",
      "./HTML/Articles/Dev/dev_s1-12_rrrb.html",
      "./HTML/Articles/Dev/dev_s1-11_bb.html",
      "./HTML/Articles/Dev/dev_s1-10_psb.html",
      "./HTML/Articles/Dev/dev_s1-9_s0.html",
      "./HTML/Articles/Dev/dev_s1-8_cw0.html",
      "./HTML/Articles/Dev/dev_s1-7_dw0.html",
      "./HTML/Articles/Dev/dev_s1-6_bw0.html",
      "./HTML/Articles/Dev/dev_s1-5_gp0.html",
      "./HTML/Articles/Dev/dev_s1-4_gw0.html",
      "./HTML/Articles/Dev/dev_s1-3_ab0.html",
      "./HTML/Articles/Dev/dev_s1-2_hn0.html",
      "./HTML/Articles/Dev/dev_s1-1_lohp.html",
      "./HTML/Articles/Dev/dev_s1-0_wit.html",
    ],
    "log-item-template"
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
    "log-item-template"
  ),
};

class NavAutoTager {
  constructor(prefix) {
    this.prefix = prefix;
    this.index = 0;
  }

  SetTag(element) {
    let tag = this.prefix + this.index.toString();
    element.id = tag;
    this.index++;
    return tag;
  }

  Claer() {
    this.index = 0;
  }

  TryTag(element, tagElement) {
    if (tagElement == null) {
      return this.SetTag(element);
    } else {
      element.id = tagElement.innerHTML;
      return element.id;
    }
  }
}
// constant class instances
const autoTager = new NavAutoTager("index_");

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
// Mhthod to be called on load
function MakePageList(pageName) {
  if (pageName in pageLists) {
    MakeIndex(pageLists[pageName]);
  } else {
    console.warn("Page name " + pageName + " is not defined");
  }
}
// =============================

// index setup methods
function MakeIndex(pageDetails) {
  pageDetails.Claer();
  pageDetails.hrefList.forEach((href) => {
    let indexElement = MakeIndexEntry(pageDetails);
    LaodEntry(pageDetails, href).then((mainElem) => {
      SetNav(mainElem, indexElement);
    });
  });

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

  function SetNav(mainEntry, indexElem) {
    entryName = mainEntry.getElementsByClassName("p-name")[0].innerHTML;
    entryTag = mainEntry.getElementsByClassName("nav-tag")[0];

    let navTag = autoTager.TryTag(mainEntry, entryTag);

    SetIndexName(indexElem, entryName);
    SetIndexHref(indexElem, navTag);
  }

  function SetIndexName(indexElem, entryName) {
    let indexName = indexElem.getElementsByClassName("p-name")[0];
    indexName.innerHTML = entryName;
  }
  function SetIndexHref(indexElem, localTag) {
    let anchor = indexElem.querySelector("a");
    anchor.href = localTag;
  }
}
