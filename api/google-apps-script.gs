/**
 * QuickQuest response collector.
 * 1. Create a Google Sheet for responses.
 * 2. In the Sheet, choose Extensions > Apps Script and paste this file's contents.
 * 3. Deploy > New deployment > Web app; Execute as: Me; Who has access: Anyone.
 * 4. Copy the Web app URL into DATA_ENDPOINT in app.js.
 */
const SHEET_NAME = 'Challenge Responses';

// Health check: visiting the /exec URL in a browser should show this, confirming the deployment is live.
function doGet() {
  return ContentService.createTextOutput('QuickQuest endpoint is live. Submit responses via POST.');
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Submitted At (UTC)', 'Name', 'Contact Number', 'Event Interest', 'Total Score', 'Tech + General Score', 'Agenda Score', 'Consent']);
      sheet.setFrozenRows(1);
    }
    const p = (e && e.parameter) ? e.parameter : {};
    const name = String(p.name || '').trim().slice(0, 80);
    const phone = String(p.phone || '').trim().slice(0, 25);
    const interest = String(p.interest || '').trim();
    const consent = String(p.consent || '') === 'yes';
    if (!name || !phone || !['Yes', 'Maybe', 'No'].includes(interest) || !consent) {
      return ContentService.createTextOutput('Invalid submission');
    }
    sheet.appendRow([
      new Date(), name, phone, interest,
      Number(p.score) || 0,
      Number(p.techGeneralScore) || 0,
      Number(p.agendaScore) || 0,
      consent ? 'Yes' : 'No'
    ]);
    return ContentService.createTextOutput('OK');
  } finally {
    lock.releaseLock();
  }
}
