class TabGroup extends HTMLElement {
  static get observedAttributes() {
    return ["title", "variant"];
  }

  static get #template() {
    return document.getElementById("tab-group-template").cloneNode(true);
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

  connectedCallback() {
    const fragment = document.createDocumentFragment();
    const tabList = document.createElement("ol");
    tabList.role = "tablist";
    fragment.appendChild(tabList);

    this.querySelectorAll("details").forEach((details, index) => {
      const detailsClone = details.cloneNode(true);

      const summary = detailsClone.querySelector("summary");

      const title = summary.textContent;

      detailsClone.removeChild(summary);

      const pairId = TabGroup.#nextId;

      const tab = document.createElement("li");
      tab.role = "tab";
      tab.id = `tab-${pairId}`;
      tab.ariaSelected = index === 0;
      // Non-reflected attribute
      tab.setAttribute("aria-controls", `panel-${pairId}`);

      const tabButton = document.createElement("button");
      tabButton.type = "button";
      tabButton.textContent = title;
      tabButton.tabIndex = index === 0 ? 0 : -1;
      tab.appendChild(tabButton);
      tabList.appendChild(tab);

      const panel = document.createElement("section");
      panel.role = "tabpanel";
      panel.id = `panel-${pairId}`;
      panel.hidden = index !== 0;
      // Non-reflected attribute
      panel.setAttribute("aria-labelledby", `tab-${pairId}`);
      panel.innerHTML = detailsClone.innerHTML;
      fragment.appendChild(panel);
    });

    console.log(fragment);

    this.replaceChildren(fragment);

    this.#update();
  }

  attributeChangedCallback() {
    this.#update();
  }

  #update() {
    const tabList = this.querySelector('[role="tablist"]');

    tabList.classList.remove("pill", "underline");
    tabList.classList.add(this.variant);

    tabList.ariaLabel = this.title;
  }

  get variant() {
    const v = this.getAttribute("variant");

    if (v === "underline") {
      return "underline";
    } else {
      return "pill";
    }
  }

  get title() {
    return this.getAttribute("title");
  }
}

customElements.define("dag-tab-group", TabGroup);
