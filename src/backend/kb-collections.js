// backend/kb-collections.js
// Makes sure the two form inbox collections exist (ContactMessages, EventRegistrations), creating them the first
// time a form is sent if they're missing. Also creates the public News collection (with two starter posts) the first
// time a page that shows news loads and finds it missing. Both are Admin-only: site visitors never read them; staff read them in
// the CMS. Safe to leave in place: once a collection exists this does one quick check per server instance.
import wixData from 'wix-data';
import { collections } from 'wix-data.v2';
import { elevate } from 'wix-auth';

const T = (key, displayName) => ({ key, displayName, type: 'TEXT' });
const D = (key, displayName) => ({ key, displayName, type: 'DATETIME' });
const F = (type) => (key, displayName) => ({ key, displayName, type });

const SCHEMAS = {
  ContactMessages: {
    displayName: 'Contact Messages',
    fields: [T('title', 'Title'), T('ref', 'Reference'), T('status', 'Status'), T('source', 'Source'), T('name', 'Name'),
      T('email', 'Email'), T('phone', 'Phone'), T('ussf', 'U.S. Soccer ID'), T('role', 'Role'), T('topic', 'Topic'),
      T('topicLabel', 'Topic (label)'), T('message', 'Message'), T('refName', 'Referee name'), T('refMatch', 'Referee match'),
      T('dob', 'Date of birth'), T('gender', 'Gender'), T('address', 'Address'), T('fromState', 'From state'),
      T('currentLicense', 'Current license'), T('parentEmail', 'Parent email')]
  },
  EventRegistrations: {
    displayName: 'Event Registrations',
    fields: [T('title', 'Title'), T('ref', 'Reference'), T('eventId', 'Event ID'), T('eventTitle', 'Event'), T('eventDate', 'Event date'),
      T('status', 'Status'), T('source', 'Source'), T('firstName', 'First name'), T('lastName', 'Last name'), T('email', 'Email'),
      T('phone', 'Phone'), T('ussfId', 'U.S. Soccer ID'), T('sessions', 'Sessions'), T('sessionLabels', 'Session labels'),
      T('experience', 'Years refereeing'), T('shirtFit', 'Shirt fit'), T('shirtSize', 'Shirt size'), T('dietary', 'Dietary needs'),
      D('registeredAt', 'Registered at'), D('updatedAt', 'Updated at')]
  },
  // News posts: the homepage News list and the /news page. Anyone can read; staff add and edit posts in the CMS.
  News: {
    displayName: 'News',
    permissions: { read: 'ANYONE', insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' },
    fields: [T('title', 'Title'), T('slug', 'Link name (news?n=...)'), F('DATE')('date', 'Post date'),
      T('summary', 'Summary (1-2 sentences for the lists)'), F('RICH_TEXT')('body', 'Body'),
      T('category', 'Label (Announcement, Video, Guide...)'), F('IMAGE')('image', 'Cover photo'),
      F('URL')('videoUrl', 'Video link (YouTube or Vimeo)'), F('DOCUMENT')('document', 'PDF'),
      T('documentLabel', 'PDF button text'), T('linkUrl', 'Button link (optional)'), T('linkLabel', 'Button text'),
      F('BOOLEAN')('showIt', 'Show it'), F('BOOLEAN')('pinned', 'Pin to top')],
    seed: [
      { title: 'Register for the 2026 Referee Academy: Saturday, Dec 19 in Chandler', slug: '2026-referee-academy', date: '2026-09-20',
        summary: 'A full afternoon of training at the Avion Center in Chandler. Lunch at 11:30, instruction from 12:00 to 4:30. Open to every Arizona referee.',
        body: '<p>The 2026 Referee Academy is <strong>Saturday, December 19</strong> at the Avion Center in Chandler. Lunch is at 11:30 and training runs from 12:00 to 4:30.</p><p>There is no cap and no registration deadline, but please register so we can plan lunch and shirts. Bring a notebook or your phone for notes, your cards and a whistle, and dress comfortably.</p>',
        category: 'Event', linkUrl: '/webinars#academy', linkLabel: 'Academy details and registration', showIt: true, pinned: true },
      { title: 'ASRA launches Referee Education webinars for the 2026-27 season', slug: 'referee-education-webinars-2026-27', date: '2026-08-15',
        summary: 'New Referee Orientation every Monday at 8 PM, and Referee Open Office Hours the first Sunday of each month at 8 PM, both on Zoom.',
        body: '<p>This season ASRA is running two free webinar series on Zoom:</p><ul><li><p><strong>New Referee Orientation</strong>, every Monday at 8 PM: what to expect in your first games, how assignors work and how to get started in Assignr.</p></li><li><p><strong>Referee Open Office Hours</strong>, the first Sunday of each month at 8 PM. Bring any question.</p></li></ul><p>Can not make it live? The orientation is also on YouTube.</p>',
        category: 'Education', linkUrl: '/webinars', linkLabel: 'See the webinar schedule', showIt: true, pinned: false }
    ]
  }
};

const ready = {};

export async function ensureCollection(id) {
  if (ready[id]) return;
  try {
    await wixData.query(id).limit(1).find({ suppressAuth: true });
    ready[id] = true;
    return;
  } catch (e) {
    // Missing collection: create it below. Any other error: let the caller's own query report it.
  }
  const s = SCHEMAS[id];
  if (!s) return;
  try {
    await elevate(collections.createDataCollection)({
      _id: id,
      displayName: s.displayName,
      fields: s.fields,
      permissions: s.permissions || { read: 'ADMIN', insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' }
    });
    if (s.seed && s.seed.length) {
      try { await wixData.bulkInsert(id, s.seed, { suppressAuth: true }); } catch (e) { console.error('kb: could not add starter rows to ' + id, e); }
    }
    ready[id] = true;
  } catch (e) {
    console.error('kb: could not create collection ' + id, e);
  }
}
