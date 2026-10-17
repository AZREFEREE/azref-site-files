// Velo page code for /scholarship  (custom element #kbPage draws kb-scholarship; page design lives in js/kb-scholarship.js)
// The class picker uses the Referee Courses CMS collection. Applications arrive as kb-submit events and go through
// backend/contact.jsw, the same pipeline as the contact form: saved to ContactMessages, sent to the ROC Inbox,
// a confirmation emailed to the applicant and a notice to admin@azref.com.
import { renderPage, sendResult } from 'public/kb-velo.js';
import { sendContact } from 'backend/contact.jsw';

const LABELS = { name: 'name', email: 'email', message: 'application', parentEmail: 'parent or guardian email' };

function toResult(r) {
  if (r && r.ok) return { ok: true, ref: r.ref };
  const e = (r && r.error) || '';
  if (e === 'invalid') return { ok: false, fields: r.fields || [], message: 'Please check: ' + (r.fields || []).map((k) => LABELS[k] || k).join(', ') + '.' };
  if (e === 'rate') return { ok: false, message: 'You’ve sent several applications in the last hour. Please email admin@azref.com instead.' };
  return { ok: false };
}

$w.onReady(async function () {
  const el = $w('#kbPage');
  el.on('kb-submit', async (event) => {
    const d = event.detail || {};
    let result;
    try { result = toResult(await sendContact(d.data)); }
    catch (err) { console.error('scholarship application failed', err); result = { ok: false }; }
    sendResult(el, d.requestId, result);
  });
  await renderPage(el, 'kb-scholarship');
});
