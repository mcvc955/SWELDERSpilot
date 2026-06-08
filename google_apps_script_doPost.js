/*
 Google Apps Script Web App template (paste into script.google.com)
 - Appends data to both a "Master" sheet (flattened CSV rows) and individual participant-session sheets
 - Replace REPLACE_SPREADSHEET_ID with your spreadsheet ID
 - Deploy the script as a Web App (Execute as: Me, Who has access: Anyone, even anonymous)
*/

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var filename = payload.filename || '';
    var csv = payload.csv || '';

    // Open the target spreadsheet
    var ss = SpreadsheetApp.openById('1SoLN-vWqgzXrTz2-Y3VA3G67otJzohVuKKDKeICiKLA');
    
    // Extract participant ID and session from filename
    // Expected format: "SWELDERS_RT_Session1_participant123_1717934567890"
    var parts = filename.split('_');
    var ptcId = parts[3] || 'unknown';
    var sessionInfo = parts[1] + '_' + parts[2]; // e.g., "RT_Session1"
    var sheetName = ptcId + '_' + sessionInfo; // e.g., "participant123_RT_Session1"

    // Get or create master sheet
    var masterSheet = ss.getSheetByName('Master');
    if (!masterSheet) {
      masterSheet = ss.insertSheet('Master', 0);
    }

    // Get or create individual participant-session sheet
    var individualSheet = ss.getSheetByName(sheetName);
    if (!individualSheet) {
      individualSheet = ss.insertSheet(sheetName);
    }

    // Parse CSV into rows
    var csvLines = csv.trim().split('\n');
    if (csvLines.length === 0) {
      throw new Error('Empty CSV data');
    }

    // Get headers from first line
    var headers = csvLines[0].split(',').map(function(h) { return h.trim(); });

    // Initialize master sheet headers on first use
    if (masterSheet.getLastRow() === 0) {
      var masterHeaders = ['Timestamp', 'Participant_ID', 'Session', 'Filename'].concat(headers);
      masterSheet.appendRow(masterHeaders);
    }

    // Initialize individual sheet headers on first use
    if (individualSheet.getLastRow() === 0) {
      var individualHeaders = ['Timestamp', 'Filename'].concat(headers);
      individualSheet.appendRow(individualHeaders);
    }

    // Process each data row (skip header row at index 0)
    var timestamp = new Date();
    for (var i = 1; i < csvLines.length; i++) {
      var values = csvLines[i].split(',').map(function(v) { return v.trim(); });
      
      // Append to master sheet: [Timestamp, Participant_ID, Session, Filename, ...csv_columns]
      var masterRow = [timestamp, ptcId, sessionInfo, filename].concat(values);
      masterSheet.appendRow(masterRow);

      // Append to individual sheet: [Timestamp, Filename, ...csv_columns]
      var individualRow = [timestamp, filename].concat(values);
      individualSheet.appendRow(individualRow);
    }

    return ContentService
      .createTextOutput(JSON.stringify({result: 'success', sheet: sheetName, rowsAdded: csvLines.length - 1}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
