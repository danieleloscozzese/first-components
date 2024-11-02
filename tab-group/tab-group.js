/**
 * Focuses without scroll and then smoothly scrolls horizontally to the tab.
 * The two operations are separated by a frame.
 * @param {HTMLElement} element The element to focus and scroll to.
 * @returns {void}
 */
const focusAndScroll = (element) => {
  requestAnimationFrame(() => {
    element.focus({ preventScroll: true });

    requestAnimationFrame(() => {
      // Smoothly scroll to the element, aligning it with the start of the
      // container to ensure the tab is fully visible.
      element.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    });
  });
};

/**
 * Implements the manual keyboard navigation for the tab group.
 * @param {KeyboardEvent} evt The `keydown` event triggered on a tab's button.
 * @param {Number} index The index of the tab in the collection.
 * @returns {void}
 */
const navigateTabs = (evt, index) => {
  // Keyboard navigation is handled but tabbing is left to the browser
  if (evt.key === "Tab") {
    return;
  }

  evt.preventDefault();
  evt.stopPropagation();

  const containingTabList = evt.currentTarget.parentElement?.parentElement;

  if (containingTabList?.role !== "tablist") {
    throw new Error("Broken structure, unable to proceed");
  }

  /**
   * @type {NodeListOf<HTMLButtonElement>} tabButtons The buttons in the tab list.
   */
  const tabButtons = containingTabList.querySelectorAll('[role="tab"] button');

  // Useful names for the indices
  const first = 0,
    last = tabButtons.length - 1,
    next = index + 1,
    previous = index - 1;

  // With the default prevented, the "click" equivalent needs to be triggered
  if (evt.key === "Enter" || evt.key === " " || evt.code === "Space") {
    evt.currentTarget.click();
  }
  // Otherwise handle the navigation:
  // Going to the first tab
  else if (evt.key === "Home" || (evt.key === "ArrowLeft" && evt.metaKey)) {
    focusAndScroll(tabButtons[first]);
  }
  // Or going to the last tab
  else if (evt.key === "End" || (evt.key === "ArrowRight" && evt.metaKey)) {
    focusAndScroll(tabButtons[last]);
  }
  // Moving to the right (next tab)
  else if (evt.key === "ArrowRight") {
    if (next < tabButtons.length) {
      focusAndScroll(tabButtons[next]);
    }
    // Loop back to the start if the focus is at the end
    else {
      focusAndScroll(tabButtons[first]);
    }
  }
  // Moving to the left (previous tab)
  else if (evt.key === "ArrowLeft") {
    if (index > first) {
      focusAndScroll(tabButtons[previous]);
    }
    // Loop around to the end if the focus is at the start
    else {
      focusAndScroll(tabButtons[last]);
    }
  }
};

class TabGroup extends HTMLElement {
  static get observedAttributes() {
    return ["title", "variant"];
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

  connectedCallback() {
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
      tabButton.addEventListener("keydown", (evt) => navigateTabs(evt, index), {
        passive: false,
      });
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
      tab.querySelector("button").tabIndex =
        index === this.#selectedTabIndex ? 0 : -1;
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
      return "pill";
    }
  }

  get title() {
    return this.getAttribute("title");
  }
}

customElements.define("dagher-tab-group", TabGroup);
