// Page code: draws the kb-fitness element (#kbPage) with its CMS rows. Page text/design lives in GitHub
// (AZREFEREE/azref-site-files, js/kb-fitness.js); the changing content lives in the Wix CMS.
import { renderPage } from 'public/kb-velo.js';

$w.onReady(function () {
  return renderPage($w('#kbPage'), 'kb-fitness');
});
