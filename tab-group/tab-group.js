class TabGroup extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }

  static get #template() {
    return document.getElementById("tab-group-template").cloneNode(true);
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

      console.group(`Tab ${index + 1}`);
      console.log("The title is", title);
      console.log("The content is", detailsClone.innerHTML);
      console.groupEnd();

      const tab = document.createElement("li");
      tab.role = "tab";
      tab.textContent = title;
      tab.classList.add("tab");
      tabList.appendChild(tab);

      const panel = document.createElement("section");
      panel.role = "tabpanel";
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
  }

  get variant() {
    const v = this.getAttribute("variant");

    if (v === "underline") {
      return "underline";
    } else {
      return "pill";
    }
  }
}

customElements.define("dag-tab-group", TabGroup);
