// Page code for /news: draws the kb-news element (#kbPage) with the News CMS rows. One page does both views:
// /news lists every post, /news?n=<link name> shows one post (body, video, PDF, button).
// Page text/design lives in GitHub (AZREFEREE/azref-site-files, js/kb-news.js); posts live in the Wix CMS (News).
import { renderPage, loadRows } from 'public/kb-velo.js';
import wixLocationFrontend from 'wix-location-frontend';
import wixSeoFrontend from 'wix-seo-frontend';

function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

async function seo() {
  const n = (wixLocationFrontend.query || {}).n;
  if (!n) { wixSeoFrontend.setTitle('News & Updates | Arizona Soccer Referees'); return; }
  try {
    const post = (await loadRows('news')).find((r) => slugify(r.slug || r.title) === n);
    if (post && post.title) wixSeoFrontend.setTitle(post.title + ' | Arizona Soccer Referees');
  } catch (e) { /* keep the page's own title */ }
}

$w.onReady(function () {
  wixLocationFrontend.onChange(() => { renderPage($w('#kbPage'), 'kb-news'); seo(); });
  seo();
  return renderPage($w('#kbPage'), 'kb-news');
});
