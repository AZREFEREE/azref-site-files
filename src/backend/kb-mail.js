// backend/kb-mail.js
// Sends the branded azref.com emails with Wix Triggered Emails (Dashboard > Developer Tools > Triggered Emails).
// The email designs live in /emails/*.html in this repo (built by emails/gen.py) and are pasted into each
// Triggered Email's HTML block. Each email's ID (shown in the Triggered Emails list) goes in EMAILS below.
// Email failures are logged (Dashboard > Developer Tools > Logging Tools) but never block a form submission:
// the message / registration is already saved in the CMS before anything is emailed.
import { contacts, triggeredEmails } from 'wix-crm-backend';
import { elevate } from 'wix-auth';

export const ADMIN_EMAIL = 'admin@azref.com';
export const EMAILS = {
  contactConfirm: 'VWm6OMe',   // "We got your message (${ref})"            -> the person who wrote in
  contactAdmin: '',            // "New message ${ref}: ${topic} from ${name}" -> admin@azref.com
  regConfirm: '',              // "You're registered: ${event} (${ref})"       -> the registrant
  regAdmin: ''                 // "New registration ${ref}: ${event} - ${name}" -> admin@azref.com
};

const appendOrCreate = elevate(contacts.appendOrCreateContact);
const emailContact = elevate(triggeredEmails.emailContact);

function str(v) { const t = String(v === undefined || v === null ? '' : v).trim(); return t || '—'; }

/** Find or create the CRM contact for an email address; returns the contactId. */
async function contactIdFor(email, first, last) {
  const info = { emails: [{ email }] };
  if (first || last) info.name = { first: first || '', last: last || '' };
  const r = await appendOrCreate(info);
  return r.contactId;
}

/**
 * sendEmail('contactConfirm', { email, first, last }, { ref, name, ... }) -> true | false
 * Every variable is sent as a string; empty values show as a dash.
 */
export async function sendEmail(key, to, vars) {
  const id = EMAILS[key];
  if (!id) return false;
  try {
    const contactId = await contactIdFor(String(to.email || '').trim().toLowerCase(), to.first, to.last);
    const variables = { SITE_URL: 'https://www.azref.com' };
    Object.keys(vars || {}).forEach(k => { variables[k] = str(vars[k]); });
    await emailContact(id, contactId, { variables });
    return true;
  } catch (e) {
    console.error('kb-mail: ' + key + ' to ' + (to && to.email) + ' failed: ' + (e && (e.message || e)));
    return false;
  }
}

/** Same email to the ASRA inbox. */
export function sendAdmin(key, vars) {
  return sendEmail(key, { email: ADMIN_EMAIL }, vars);
}
