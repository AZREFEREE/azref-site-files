  window.customElements.define(TAG, KBPage);
  window.__KB_PAGES = window.__KB_PAGES || {};
  window.__KB_PAGES[TAG] = KBPage;
  window.__KB_LAST = TAG;
  try { window.dispatchEvent(new CustomEvent('kb-page-defined', { detail: TAG })); } catch (e) {}
  /* Wix Studio won't save a custom tag name, so every page's element is Wix's default tag. ONE shared class
     is registered for that tag (by whichever page file loads first). It reads the page name Velo sends in the
     data attribute ({"page":"kb-become",...}) and hands the element to that page's code, loading the page's
     file first if it isn't loaded yet. This keeps pages right when Wix switches pages without a reload. */
  if (!window.customElements.get('wix-default-custom-element')) {
    var KB_SRC = (document.currentScript && document.currentScript.src) || '';
    var KB_BASE = KB_SRC.split('?')[0].replace(/[^\/]*$/, '') || 'https://cdn.jsdelivr.net/gh/AZREFEREE/azref-site-files@main/js/';
    var KB_VER = KB_SRC.indexOf('?') >= 0 ? '?' + KB_SRC.split('?')[1] : '';   /* ?v=... from the loader, busts browser caches */
    var kbBind = function (el) {
      if (el.__kbCls) return el.__kbCls;
      var raw = el.getAttribute('data');
      if (!raw) return null;
      var name = null;
      try { name = JSON.parse(raw).page || null; } catch (e) {}
      if (!name) name = window.__KB_LAST;
      if (!/^kb-[a-z]+$/.test(name || '')) return null;
      var C = window.__KB_PAGES[name];
      if (!C) { kbLoad(name, el); return null; }
      el.__kbCls = C;
      Object.setPrototypeOf(el, C.prototype);
      return C;
    };
    var kbLoad = function (name, el) {
      if (!el.__kbWaiting) {
        el.__kbWaiting = true;
        var h = function (e) {
          if (e.detail !== name) return;
          window.removeEventListener('kb-page-defined', h);
          el.__kbWaiting = false;
          if (el.isConnected) A.connectedCallback.call(el);
        };
        window.addEventListener('kb-page-defined', h);
      }
      var src = KB_BASE + name + '.js' + KB_VER;
      if (!document.querySelector('script[src="' + src + '"]')) {
        var s = document.createElement('script'); s.src = src; s.async = true; document.head.appendChild(s);
      }
    };
    var KBAlias = function () { return Reflect.construct(HTMLElement, [], new.target || KBAlias); };
    KBAlias.prototype = Object.create(HTMLElement.prototype);
    KBAlias.prototype.constructor = KBAlias;
    Object.setPrototypeOf(KBAlias, HTMLElement);
    Object.defineProperty(KBAlias, 'observedAttributes', { get: function () { return ['data', 'result']; } });
    var A = KBAlias.prototype;
    A.connectedCallback = function () { var C = kbBind(this); if (C) C.prototype.connectedCallback.call(this); };
    A.disconnectedCallback = function () { if (this.__kbCls) this.__kbCls.prototype.disconnectedCallback.call(this); };
    A.attributeChangedCallback = function (n, o, v) {
      if (this.__kbCls) return this.__kbCls.prototype.attributeChangedCallback.call(this, n, o, v);
      if (n === 'data' && v != null && this.isConnected) A.connectedCallback.call(this);
    };
    window.customElements.define('wix-default-custom-element', KBAlias);
  }
})();
