class TabGroup extends HTMLElement {
  static get observedAttributes() {
    return ["aria-label", "variant"];
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
      tabList.appendChild(tab);

      const panel = document.createElement("section");
      panel.role = "tabpanel";
      panel.innerHTML = detailsClone.innerHTML;
      fragment.appendChild(panel);
    });

    console.log(fragment);

    this.replaceChildren(fragment);
  }
}

customElements.define("dag-tab-group", TabGroup);
