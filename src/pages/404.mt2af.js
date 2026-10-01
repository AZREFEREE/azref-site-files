// Page code: draws the kb-notfound element (#kbPage) on the 404 page. Page text/design lives in GitHub
// (AZREFEREE/azref-site-files, js/kb-notfound.js).
import { renderPage } from 'public/kb-velo.js';

$w.onReady(function () {
  const el = $w('#kbPage');
  if (!el || !el.id) return; // element not placed on the 404 page yet
  return renderPage(el, 'kb-notfound');
});
