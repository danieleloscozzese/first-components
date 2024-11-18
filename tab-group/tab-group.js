import { clickTab, navigateTabs } from "./tab-behaviors.js";

class TabGroup extends HTMLElement {
  static get observedAttributes() {
    return ["title", "variant", "with-manual-switching"];
  }

  static #idGenerator = (function* () {
    let id = 1;
    while (true) {
      yield id++;
    }
  })();

  static get #nextId() {
    return TabGroup.#idGenerator.next().value;
  }

  #selectedTabIndex = 0;
  #mounted = false;

  connectedCallback() {
    if (!this.#mounted) {
      const base = document
        .getElementById("tab-group-structure")
        .content.cloneNode(true);
      const tabList = base.querySelector('[role="tablist"]');

      this.querySelectorAll("details").forEach((details, index) => {
        const detailsClone = details.cloneNode(true);

        const summary = detailsClone.querySelector("summary");

        const title = summary.textContent;

        detailsClone.removeChild(summary);

        const pairId = TabGroup.#nextId;

        const tab = document.createElement("li");
        tab.role = "tab";
        tab.id = `tab-${pairId}`;
        tab.ariaSelected = index === this.#selectedTabIndex;
        // Non-reflected attribute
        tab.setAttribute("aria-controls", `panel-${pairId}`);

        const tabButton = document.createElement("button");
        tabButton.type = "button";
        tabButton.textContent = title;
        tabButton.tabIndex = index === this.#selectedTabIndex ? 0 : -1;
        tabButton.addEventListener(
          "keydown",
          (evt) => navigateTabs(evt, index),
          {
            passive: false,
          }
        );

        tabButton.addEventListener("click", () => {
          // Private setter?
          this.#selectedTabIndex = index;
          this.#update();
        });
        tab.appendChild(tabButton);
        tabList.appendChild(tab);

        const panel = document.createElement("section");
        panel.role = "tabpanel";
        panel.id = `panel-${pairId}`;
        panel.hidden = index !== 0;
        // Non-reflected attribute
        panel.setAttribute("aria-labelledby", `tab-${pairId}`);
        panel.innerHTML = detailsClone.innerHTML;
        base.appendChild(panel);
      });

      this.replaceChildren(base);
      // The transformation of the content is unidirectional
      this.#mounted = true;
    }

    this.#update();
  }

  attributeChangedCallback() {
    this.#update();
  }

  /**
   * Aligns the DOM with the current state of the component.
   */
  #update() {
    const tabList = this.querySelector('[role="tablist"]');

    if (tabList === null) {
      return;
    }

    tabList.classList.remove("pill", "underline");
    tabList.classList.add(this.variant);

    tabList.ariaLabel = this.title;

    tabList.querySelectorAll('[role="tab"]').forEach((tab, index) => {
      tab.ariaSelected = index === this.#selectedTabIndex;

      const tabButton = tab.querySelector("button");
      tabButton.tabIndex = index === this.#selectedTabIndex ? 0 : -1;

      tabButton.removeEventListener("focusin", clickTab);

      if (!this.withManualSwitching) {
        tabButton.addEventListener("focusin", clickTab, { passive: true });
      }
    });

    this.querySelectorAll('[role="tabpanel"]').forEach((panel, index) => {
      panel.hidden = index !== this.#selectedTabIndex;
    });
  }

  // Getters for the attributes: the attribute defines the value
  get variant() {
    const v = this.getAttribute("variant");

    if (v === "underline") {
      return "underline";
    } else {
      // This is the default, also when unsupported values are passed.
      return "pill";
    }
  }

  get withManualSwitching() {
    const ms = this.getAttribute("with-manual-switching");

    return Boolean(ms);
  }

  get title() {
    return this.getAttribute("title");
  }

  /**
   * @param {String} v
   */
  set variant(v) {
    this.setAttribute("variant", v);
  }

  set withManualSwitching(ms) {
    if (ms) {
      this.setAttribute("with-manual-switching", "true");
    } else {
      this.removeAttribute("with-manual-switching");
    }
  }

  set title(t) {
    this.setAttribute("title", t);
  }
}

customElements.define("dagher-tab-group", TabGroup);
