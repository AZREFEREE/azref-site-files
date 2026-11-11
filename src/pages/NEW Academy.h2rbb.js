// Page code: draws the kb-academy element (#kbPage), the 2026 Referee Academy page (/academy). Page text/design lives in GitHub
// (AZREFEREE/azref-site-files, js/kb-academy.js). Registration itself happens on /register?e=academy-2026.
import { renderPage } from 'public/kb-velo.js';

$w.onReady(function () {
  return renderPage($w('#kbPage'), 'kb-academy');
});
