class FAQItem extends HTMLElement {
  constructor() {
    super()
      .attachShadow({mode: "open"})
      .append(this.template().content.cloneNode(true));

    this.shadowRoot
      .getElementById("toggleBtn")
      .addEventListener("click", this.toggleOpen.bind(this));

    if(this.getAttribute("no-border") != null)
      this.shadowRoot
        .getElementById("toggleBtn")
        .classList.add("no-border");
      
    
      this.content = this.shadowRoot.getElementById("content");
      this.toggler = this.shadowRoot.getElementById("togglerImg");
  }

  static get observedAttributes() {
    return ["is-open"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name != "is-open" || oldValue == newValue) return;
    if(newValue != null) this.content.classList.add("open");
    else this.content.classList.remove("open");

    this.changeToggler(newValue);
  }

  toggleOpen(e) {
    this.getAttribute("is-open") != null ? this.removeAttribute("is-open") : this.setAttribute("is-open", "");
  }

  changeToggler(value) {
    const isOpen = value != null;
    this.toggler.src = isOpen 
      ? "./assets/images/icon-minus.svg"
      : "./assets/images/icon-plus.svg";
  }

  template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        h3 {
         margin: 0;
        }
        .faq__head {
          all: unset;
          width: 100%;
          display: flex;
          gap: 25px;
          justify-content: space-between;
          color: var(--clr-dark-purple);
          font-size: .9rem;
          position: relative;
          padding: 15px 0;
          cursor: pointer;
          transition: filter .1s ease-in-out; 
        }
        .faq__head > h3 {
          display: flex;
          align-items: center;
          transition: color .1s ease-in-out;
        }
        .faq__head:hover > h3, .faq__head:focus-visible > h3 {
          color: var(--clr-primary);
        }
        .faq__head.no-border::before {
          display: none;
        }
        .faq__head::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--clr-light-pink);
        }
      
        .faq__head:focus-visible #togglerImg, .faq__head:hover #togglerImg {
          filter: brightness(125%);
        }
        .faq__content {
          display: grid;
          grid-template-rows: 0fr;
          transition: opacity .2s ease-in-out, grid-template-rows .2s ease-in-out;
          color: var(--clr-grayish-purple);
          font-size: .9rem;
          line-height: 1.6;
        }
        .faq__content > div {overflow:hidden; }
        .faq__content p {
          padding-bottom: 10px;
        }
        .faq__content.open  {
          grid-template-rows: 1fr;
        }
      </style>
      <button class="faq__head" id="toggleBtn">
        <h3><slot name="faq-title"></slot></h3>
        <img id="togglerImg" src="./assets/images/icon-plus.svg"/>
      </button>
      <div id="content" class="faq__content">
        <div>
          <p><slot name="faq-description"></slot></p>
        <div>
      </div>

    `;
    return template;
  }

}

customElements.define("faq-item", FAQItem);