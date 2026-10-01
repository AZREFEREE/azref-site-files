// backend/kb-collections.js
// Makes sure the two form inbox collections exist (ContactMessages, EventRegistrations), creating them the first
// time a form is sent if they're missing. Both are Admin-only: site visitors never read them; staff read them in
// the CMS. Safe to leave in place: once a collection exists this does one quick check per server instance.
import wixData from 'wix-data';
import { collections } from 'wix-data.v2';
import { elevate } from 'wix-auth';

const T = (key, displayName) => ({ key, displayName, type: 'TEXT' });
const D = (key, displayName) => ({ key, displayName, type: 'DATETIME' });

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
      permissions: { read: 'ADMIN', insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' }
    });
    ready[id] = true;
  } catch (e) {
    console.error('kb: could not create collection ' + id, e);
  }
}
