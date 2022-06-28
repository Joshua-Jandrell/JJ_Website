// This script should be defered
SetSwup();
DoImportSetup();
init();

function SetSwup() {
  let options = {
    linkSelector:
      'a[href^="' +
      window.location.origin +
      '"]:not([data-no-swup]), a[href^="./"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup])',
  };
  const swup = new Swup(options);
  swup.on("contentReplaced", init);
}

function init() {
  let path = window.location.pathname;
  let page = path.split("/").pop();
  if (typeof navBar === "undefined") {
    navBar = new NavBar();
  }
  console.log("inti " + page);
  navBar.SetPage(page);
  OnInit(page);
}
