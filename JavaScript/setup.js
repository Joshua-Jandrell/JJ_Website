// This script should be defered
const devLinks = [
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
];

const blogLinks = [
  "/HTML/Articles/Blog/blog_s1-7_mm.html",
  "/HTML/Articles/Blog/blog_s1-6_uxi.html",
  "/HTML/Articles/Blog/blog_s1-5_infgeo.html",
  "/HTML/Articles/Blog/blog_s1-4_re0.html",
  "/HTML/Articles/Blog/blog_s1-3_met.html",
  "/HTML/Articles/Blog/blog_s1-2_sm.html",
  "/HTML/Articles/Blog/blog_s1-1_atmt.html",
];

const gameLinks = [
  "/HTML/Articles/Game/game_s1-1_cat.html",
  "/HTML/Articles/Game/game_s1-2_idol.html",
  "/HTML/Articles/Game/game_s1-3_proj.html",
  "/HTML/Articles/Game/game_s1-4_pin.html",
  "/HTML/Articles/Game/game_s1-6_life.html",
  "/HTML/Articles/Game/game_s1-8_help.html",
];

const pageLists = {
  "devlog.html": new PageDetails("devlog", ".", devLinks, false),
  "blog.html": new PageDetails("blog", ".", blogLinks, false),
  "blogPage.html": new PageDetails("blogPage", ".", blogLinks, true),
  "games.html": new PageDetails("games", ".", gameLinks, false),
  "gamePage.html": new PageDetails("gamesPage", ".", gameLinks, true),
};

document.addEventListener("DOMContentLoaded", (event) => {
  SetSwup();
  DoImportSetup();
  Init();
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
}

function Init() {
  let path = window.location.pathname;
  let hash = window.location.hash;
  let page = path.split("/").pop();
  // A specail trick to fix issues with github pages
  if (page == "") {
    page = "index.html";
  }
  if (typeof navBar === "undefined") {
    navBar = new NavBar();
  }
  navBar.SetPage(page);
  OnInit(page, hash);
  window.scrollTo(0, 0);
}

function HashNav() {
  autoTager.Open(window.location.hash.slice(1));
}

function Huh() {
  swup.scrollTo(000);
}
