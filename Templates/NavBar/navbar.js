// Useful class
const selectedClass = "select";
const hambergerOpenClass = "nav-open";
const hamburgerId = "nav-menu";
const backButtonId = "nav-back";
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
      this.CloseMenu();
    }
    this.page = pageName;
  }

  SetElem(elem) {
    this.elem = elem;
    this.FindLinkElems(elem);
    if (this.page != null) {
      this.SetPage(this.page);
    }

    this.SetMenuToggle(elem);
    this.SetBackButton();
  }

  FindLinkElems(elem) {
    Object.keys(this.navLinks).forEach((key) => {
      if (typeof this.navLinks[key] === "string") {
        this.navLinks[key] = elem.querySelector("#" + this.navLinks[key]);
      }
    });
  }
  /* Menue toggles */
  SetMenuToggle(elem) {
    this.menuButton = elem.querySelector("#" + hamburgerId);
    this.menuButton.onclick = () => {
      this.ToggleOpen();

      return false;
    };
  }

  ToggleOpen() {
    this.GetNavBarElem().classList.toggle(hambergerOpenClass);
  }

  CloseMenu() {
    this.GetNavBarElem().classList.remove(hambergerOpenClass);
  }
  GetNavBarElem() {
    if (typeof this.navBarElem === "undefined") {
      // only serch doc once, then store a referance to element
      this.navBarElem = document.getElementById("nav-bar");
    }
    return this.navBarElem;
  }

  // Back button
  SetBackButton() {
    this.GetNavBarElem().querySelector("#" + backButtonId).onclick = () => {
      this.GoBack();
    };
  }

  GoBack() {
    console.log(document.referrer);
    // What a normal sane person would do
    window.history.back();
    // Now with swup lol:
    // => Back is not animated by design (https://github.com/swup/swup/issues/47)
    // => hacky sollution is to make a dummy link and click it but this has odd behaviour from time to time
    // => this is ba
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
