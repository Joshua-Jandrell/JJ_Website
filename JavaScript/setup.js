// This script should be defered

document.addEventListener("DOMContentLoaded", (event) => {
  SetSwup();
  DoImportSetup();
  Init();
  console.log("noni");
});

function SetSwup() {
  let options = {
    linkSelector:
      'a[href^="' +
      window.location.origin +
      '"]:not([data-no-swup]), a[href^="./"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup])',
    containers: ["#swup"],
    plugins: [new SwupScrollPlugin()],
  };

  const swup = new Swup(options);
  swup.on("contentReplaced", Init);
  swup.on("scrollDone", HashNav);
  // window.addEventListener('locationchange', function () );
  console.log(swup);
}

function Init() {
  let path = window.location.pathname;
  let hash = window.location.hash;
  let page = path.split("/").pop();
  if (typeof navBar === "undefined") {
    navBar = new NavBar();
  }
  console.log("inti " + page);
  navBar.SetPage(page);
  OnInit(page, hash);
  window.scrollTo(0, 0);
}

function HashNav() {
  console.log("hahaha" + window.location.hash.slice(1));
  autoTager.Open(window.location.hash.slice(1));
}
function Test() {
  console.log("eish" + window.location.hash.slice(1));
}

function Huh() {
  swup.scrollTo();
}
