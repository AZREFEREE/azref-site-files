// public/kb-velo.js
// Shared Velo helpers for the kb-<page> custom elements. Every page's code imports from here, so collection
// IDs live in ONE place. Install: Public & Backend > Public > + New file "kb-velo.js", paste this file.
import wixData from 'wix-data';
import wixLocationFrontend from 'wix-location-frontend';

/* Wix CMS collection IDs (CMS > collection > Settings shows the ID). */
export const COLLECTIONS = {
  events: 'Import4',          // Events (new site)
  fitness: 'Import6',         // Fitness Tests (new site)
  announcements: 'Import7',   // Homepage Announcements
  directors: 'Import8',       // Directors
  assignors: 'Import9',       // Assignors
  programs: 'Import10',       // Assignor Programs
  faq: 'Import11',            // FAQ
  edu: 'Import12',            // Education Events
  licenses: 'Import13',       // License Requirements
  courses: 'Import14'         // Referee Courses
};

/** Arizona date (UTC-7 all year, no DST) as YYYY-MM-DD. */
export function azToday() {
  return new Date(Date.now() - 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/* Keep the payload small: drop Wix system fields except _id/_createdDate, and dynamic-page link fields. */
function slim(item) {
  const out = {};
  Object.keys(item).forEach((k) => {
    if (k.startsWith('link-')) return;
    if (k.startsWith('_') && k !== '_id' && k !== '_createdDate') return;
    out[k] = item[k];
  });
  return out;
}

async function queryAll(collectionId, include) {
  let q = wixData.query(collectionId).limit(1000);
  if (include) q = q.include(include);
  let res = await q.find();
  let items = res.items;
  while (res.hasNext()) {
    res = await res.next();
    items = items.concat(res.items);
  }
  return items.map(slim);
}

/** All rows of one collection by short name ('faq', 'licenses', ...). Never throws: returns [] and logs. */
export async function loadRows(key) {
  const id = COLLECTIONS[key];
  if (!id) { console.error(`kb: unknown collection key ${key}`); return []; }
  if (key === 'programs') {
    // If "Assignors" was turned into a multi-reference field, include the referenced people.
    try { return await queryAll(id, 'assignors'); } catch (e) { /* plain text field: fall through */ }
  }
  try { return await queryAll(id); } catch (e) { console.error(`kb: could not read ${key} (${id})`, e); return []; }
}

/** URL parts the element needs: query string, path segments, dynamic-page prefix, site base URL. */
export function pageParams(extra) {
  const loc = wixLocationFrontend;
  return Object.assign({
    query: loc.query || {},
    path: loc.path || [],
    prefix: loc.prefix || '',
    baseUrl: loc.baseUrl || ''
  }, extra || {});
}

/**
 * Load the rows a page needs and hand them to the custom element.
 * @param el      $w('#kbPage')
 * @param keys    collection short names, e.g. ['faq']
 * @param extra   extra params, e.g. { slug, track } on the license page or { eventId } on the register page
 */
export async function renderPage(el, keys, extra) {
  const lists = await Promise.all(keys.map(loadRows));
  const rows = {};
  keys.forEach((k, i) => { rows[k] = lists[i]; });
  el.setAttribute('data', JSON.stringify({ rows, params: pageParams(extra), today: azToday() }));
}

/** Current item of a dynamic page's dataset (default ID dynamicDataset), or null on a regular page. */
export async function dynamicItem($w, id) {
  try {
    const ds = $w(id || '#dynamicDataset');
    if (!ds || typeof ds.onReady !== 'function') return null;
    await new Promise((resolve) => ds.onReady(resolve));
    return ds.getCurrentItem() || null;
  } catch (e) {
    return null;
  }
}

/** Send the answer to a kb-submit event back to the element. */
export function sendResult(el, requestId, result) {
  el.setAttribute('result', JSON.stringify(Object.assign({}, result, { requestId })));
}
