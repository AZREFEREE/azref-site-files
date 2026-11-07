// Velo page code for /sponsor  (custom element #kbPage draws kb-sponsor; page design lives in js/kb-sponsor.js)
// Sponsorship requests arrive as kb-submit events and go through backend/contact.jsw, the same pipeline as the
// contact form: saved to ContactMessages, sent to the ROC Inbox, a copy emailed to the sponsor and a notice to admin@azref.com.
// "Pay now" (Nov 2026): when the request carries data.checkout, backend/sponsor-pay.jsw then makes a Stripe Checkout page
// (card or ACH) and the element sends the sponsor there. Otherwise ASRA answers with a Stripe invoice or check details.
//   form 'sponsor'          -> save the request (+ Stripe Checkout if data.checkout)  -> { ok, ref, checkoutUrl?, payError? }
//   form 'sponsor-checkout' -> new Checkout for an already-saved request (try again)  -> { ok, checkoutUrl }
//   form 'sponsor-status'   -> how did the Stripe payment go? (back from Stripe, ?cs=) -> { ok, state, ref, company, ... }
import { renderPage, sendResult } from 'public/kb-velo.js';
import { sendContact } from 'backend/contact.jsw';
import { createSponsorCheckout, checkoutStatus } from 'backend/sponsor-pay.jsw';

const LABELS = { name: 'your name', email: 'email', message: 'request' };

function toResult(r) {
  if (r && r.ok) return { ok: true, ref: r.ref };
  const e = (r && r.error) || '';
  if (e === 'invalid') return { ok: false, fields: r.fields || [], message: 'Please check: ' + (r.fields || []).map((k) => LABELS[k] || k).join(', ') + '.' };
  if (e === 'rate') return { ok: false, message: 'You’ve sent several requests in the last hour. Please email admin@azref.com instead.' };
  return { ok: false };
}

async function checkout(order) {
  try {
    const c = await createSponsorCheckout(order);
    return c && c.ok ? { checkoutUrl: c.url } : { payError: (c && c.error) || 'stripe' };
  } catch (err) {
    console.error('sponsor checkout failed', err);
    return { payError: 'stripe' };
  }
}

$w.onReady(async function () {
  const el = $w('#kbPage');
  el.on('kb-submit', async (event) => {
    const d = event.detail || {};
    const data = d.data || {};
    let result;
    try {
      if (d.form === 'sponsor-status') {
        result = await checkoutStatus(data.cs);
      } else if (d.form === 'sponsor-checkout') {
        const c = await checkout(data);
        result = c.checkoutUrl ? { ok: true, checkoutUrl: c.checkoutUrl } : { ok: false, payError: c.payError };
      } else {
        const order = data.checkout;
        const contact = Object.assign({}, data);
        delete contact.checkout;
        result = toResult(await sendContact(contact));
        if (result.ok && order) {
          Object.assign(result, await checkout(Object.assign({}, order, { ref: result.ref, email: contact.email })));
        }
      }
    } catch (err) { console.error('sponsor request failed', err); result = { ok: false }; }
    sendResult(el, d.requestId, result);
  });
  await renderPage(el, 'kb-sponsor');
});
