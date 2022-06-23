// Unfornsatuanly this is the most effcient way to know what to load without needing to refferenrce links in mutiple palces.
const devlogPaths = [
  "./Pages/Dev-log/Articles/END_aMess.html",
  //"./Pages/Dev-log/Articles/cssHeaddings.html", // put more entries in here => Update still needed
  "./Pages/Dev-log/Articles/02_autoIndex.html",
  "./Pages/Dev-log/Articles/01_loadContent.html",
  "./Pages/Dev-log/Articles/shadow.html",
  "./Pages/Dev-log/Articles/template-time.html",
  "./Pages/Dev-log/Articles/fixing-devlog.html",
  "./Pages/Dev-log/Articles/another-reboot.html",
  "./Pages/Dev-log/Articles/re-re-reboot_0.html",
  "./Pages/Dev-log/Articles/back_button_0.html",
  "./Pages/Dev-log/Articles/pseudo-square-bracket_0.html",
  "./Pages/Dev-log/Articles/style_0.html",
  "./Pages/Dev-log/Articles/contact_wire_0.html",
  "./Pages/Dev-log/Articles/dev_wire_0.html",
  "./Pages/Dev-log/Articles/blog_wire_0.html",
  "./Pages/Dev-log/Articles/game_page_0.html",
  "./Pages/Dev-log/Articles/games_wire_0.html",
  "./Pages/Dev-log/Articles/about_wire_0.html",
  "./Pages/Dev-log/Articles/home_nav_0.html",
  "./Pages/Dev-log/Articles/land_on_homepage_0.html",
  "./Pages/Dev-log/Articles/what_is_this_0.html",
];

const blogPaths = [
  "./Pages/Blog/Articles/mirror-monster.html",
  "./Pages/Blog/Articles/ux-ui.html",
  "./Pages/Blog/Articles/information-geograhies-data.html",
  "./Pages/Blog/Articles/reflection-data.html",
  "./Pages/Blog/Articles/metaphore-data.html",
  "./Pages/Blog/Articles/semantic-markup.html",
  "./Pages/Blog/Articles/as-we-may-think-data.html",
];

const blogPagePaths = [
  "./Pages/Blog/Pages/mirror-monster.html",
  "./Pages/Blog/Pages/ux-ui.html",
  "./Pages/Blog/Pages/information-geo.html",
  "./Pages/Blog/Pages/reflection.html",
  "./Pages/Blog/Pages/metaphor.html",
  "./Pages/Blog/Pages/semantic-markup.html",
  "./Pages/Blog/Pages/as-we-may-think.html",
];

// sometines i would fetch a file just for the name - loading the content too would be a waste of resorces in that case.
const blogNames = [
  "The interent: a monster or a mirror?",
  "how's the UX been so far?",
  "A Close reading of Graham et al 'Towards a study of information geographies'",
  "Reflecting on this site so far",
  "What's all this Mata-phor?",
  "Semantic Markup: What is it? Who cares?",
  "''As we may Think' at 65' at 12",
];

// This file contains basic funtion used by ther js scripts
function GetPathToRoot() {
  if (typeof pathToRoot === "undefined") {
    throw "pathToRoot undefined. This must be specifically declared in-inpage script";
  }
  return pathToRoot;
}
function GetRootPath(pathFromRoot) {
  return GetPathToRoot() + pathFromRoot;
}

function SetElemAnchorRef(href, elem) {
  let a = elem.getElementsByTagName("a")[0];
  a.href = href;
}

function SetElemClassContent(content, className, elem) {
  let classElem = elem.getElementsByClassName(className)[0];
  classElem.innerHTML = content;
}

function GetArticleNumber() {
  if (typeof articleNumer !== "undefined") {
    return articleNumer;
  } else {
    return -1;
  }
}
