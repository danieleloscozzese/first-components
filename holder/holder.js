class Holder extends HTMLElement {
  static get #template() {
    const html = `
      <link rel="stylesheet" href="/holder/components.css" />

      <div class="button-holder">
        <button type="button" class="switcher">Switch sections</button>
      </div>

      <div class="content">
      <section data-is-filled="true">
        <slot></slot>
      </section>
      <section>
      </section>
      </div>`;

    return html;
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = Holder.#template;
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".switcher").addEventListener(
      "click",
      () => {
        this.#switchSections();
      },
      { passive: true }
    );
  }

  #switchSections() {
    const sections = this.shadowRoot.querySelectorAll("section");

    /** @type {HTMLElement} */
    const firstSection = sections[0],
      /** @type {HTMLElement} */
      secondSection = sections[1];

    if (firstSection.dataset.isFilled === "true") {
      secondSection.replaceChildren(...firstSection.children);

      firstSection.dataset.isFilled = "false";
      secondSection.dataset.isFilled = "true";
    } else {
      firstSection.replaceChildren(...secondSection.children);

      firstSection.dataset.isFilled = "true";
      secondSection.dataset.isFilled = "false";
    }
  }
}

customElements.define("dagher-holder", Holder);
