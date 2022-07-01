// Useful class
const selectedClass = "select";
class NavBar {
  constructor() {
    this.page = null;
    this.elem = null;
    this.navLinks = {
      "index.html": "home-nav",
      "games.html": "games-nav",
      "gamePage.html": "games-nav",
      "blog.html": "blog-nav",
      "blogPage.html": "blog-nav",
      "devlog.html": "devlog-nav",
      "about.html": "about-nav",
    };
  }

  SetPage(pageName) {
    if (this.elem != null) {
      if (this.page != null) {
        let navElem = this.navLinks[this.page];
        if (navElem == null) {
          navElem = this.navLinks["index.html.html"];
        }
        navElem.classList.remove(selectedClass);
      }
      this.navLinks[pageName].classList.add(selectedClass);
    }
    this.page = pageName;
  }

  SetElem(elem) {
    this.elem = elem;
    this.FindLinkElems(elem);
    if (this.page != null) {
      this.SetPage(this.page);
    }
  }

  FindLinkElems(elem) {
    Object.keys(this.navLinks).forEach((key) => {
      if (typeof this.navLinks[key] === "string") {
        this.navLinks[key] = elem.querySelector("#" + this.navLinks[key]);
      }
    });
  }
}
const navBar = new NavBar();

// Definition for cusstom element
document.addEventListener("DOMContentLoaded", (event) => {
  customElements.define(
    "nav-bar",
    class extends HTMLElement {
      constructor() {
        super();
        let href = GetRootPath("/Templates/NavBar/navBar.html");
        LoadContent(href, this).then((navElem) => {
          navBar.SetElem(navElem);
        });
      }
    }
  );
});
