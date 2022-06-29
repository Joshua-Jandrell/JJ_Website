// This script should be defered
SetSwup();
DoImportSetup();
Init();
console.log("noni");

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
  swup.on("samePageWithHash", HashNav);
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

function HashNav(event) {
  console.log("hahaha");
  GotoHash(window.location.hash);
}
