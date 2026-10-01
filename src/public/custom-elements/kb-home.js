// temporary test element (replaced by the real kb-home build)
class KbHome extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.innerHTML = '<div style="background:#f6c915;padding:40px;font:700 28px barlow,sans-serif">kb-home test: light DOM works.<br>' + Array.from({length: 30}, (_, i) => 'Line ' + (i + 1)).join('<br>') + '</div>';
  }
}
if (!customElements.get('kb-home')) customElements.define('kb-home', KbHome);
