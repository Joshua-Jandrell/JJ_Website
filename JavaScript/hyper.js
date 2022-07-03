// Some fun hypertext widgets

// popout containers
const popOutTextContainer = "pop-out-text";

customElements.define(
  "pop-out-text",
  class extends HTMLElement {
    constructor() {
      super();
      // Define role
      this.role = "button";
      // make it focusable
      this.tabIndex = 0;

      this.onclick = () => {
        this.toggleAttribute("open");

        // Return false to prevent this click event from bubbling
        return false;
      };
    }
  }
);

// Toggle text
customElements.define(
  "toggle-block",
  class extends HTMLElement {
    constructor() {
      super();
      // Define role
      this.role = "button";
      // make it focusable
      this.tabIndex = 0;

      this.popOuts = this.getElementsByTagName("toggle-pop-out");
      this.buttons = this.getElementsByTagName("toggle-button");

      this.toggle = (toggleName) => {
        Array.from(this.popOuts).forEach((popOut) => {
          if (popOut.id == toggleName) {
            popOut.toggleAttribute("open");
            // Focus screen reader onto element that just popped out
            popOut.focus();
          } else {
            popOut.removeAttribute("open");
          }
        });

        Array.from(this.buttons).forEach((button) => {
          if (button.for == toggleName) {
            button.classList.toggle("open");
          } else {
            button.classList.remove("open");
          }
        });
        return false;
      };
    }
  }
);
customElements.define(
  "toggle-button",
  class extends HTMLElement {
    constructor() {
      super();
      this.role = "button";
      this.tabIndex = 0;

      this.for = this.getAttribute("target");
      this.onclick = () => {
        this.parentElement.closest("toggle-block").toggle(this.for);

        // Return false to prevent this click event from bubbling
        return false;
      };
    }
  }
);
customElements.define(
  "toggle-pop-out",
  class extends HTMLElement {
    constructor() {
      super();
      this.tabIndex = 0;
      this.name = this.getAttribute("name");
    }
  }
);

// =============== Branch to

customElements.define(
  "branch-to",
  class extends HTMLElement {
    constructor() {
      super();
      this.tabIndex = 0;
      this.target = this.getAttribute("target");
      this.targetElem = document.getElementById(this.target);

      this.onclick = () => {
        this.targetElem.toggleAttribute("open");
      };
    }
  }
);
