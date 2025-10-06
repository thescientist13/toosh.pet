export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="text-center italic">
        <span>Last update: ${new Date().toISOString()}</span>
      </footer>
    `
  }
}

customElements.define('ts-footer', Footer);