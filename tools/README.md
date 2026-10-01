# How the Wix pages load (read before editing js/)

* Each Wix page has one Custom Element (ID `kbPage`) whose source is a Velo file in `src/public/custom-elements/`.
  Those are tiny loaders that add `js/kb-<page>.js?v=<VERSION>` from jsDelivr.
* Wix won't keep a custom tag name, so every page's element is `<wix-default-custom-element>`. The block at the
  end of every `js/kb-*.js` (from `window.customElements.define(TAG, KBPage);` down) registers ONE shared class
  for that tag. It reads `page` from the element's `data` attribute (sent by the page's Velo code via
  `renderPage(el, 'kb-<page>')` in `src/public/kb-velo.js`) and hands the element to that page's code, loading
  the page's js file if needed. Keep that block identical in every file (`tools/patch_dispatch.py` re-applies it).
* Page code: `src/pages/NEW <Name>.<id>.js`. The collections each page needs: `PAGES` in `src/public/kb-velo.js`.

After changing js files:
1. `bash tools/bump-version.sh` (new ?v= so browsers don't use a cached copy for 7 days)
2. commit + push
3. purge jsDelivr: POST https://purge.jsdelivr.net/ {"path":["/gh/AZREFEREE/azref-site-files@main/js/kb-home.js", ...]}
