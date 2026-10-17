// Page code: draws the kb-sponsors element (#kbPage), the sponsor wall. Page text/design lives in GitHub
// (AZREFEREE/azref-site-files, js/kb-sponsors.js).
import { renderPage } from 'public/kb-velo.js';

$w.onReady(function () {
  return renderPage($w('#kbPage'), 'kb-sponsors');
});
