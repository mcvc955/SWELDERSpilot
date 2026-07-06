/*
 Google Apps Script Web App template (paste into script.google.com)
 - Saves CSV files to Google Drive folder
 - Appends data to Master sheet in spreadsheet
 - Creates individual participant-session sheets
 - Deploy as Web App (Execute as: Me, Access: Anyone)
*/

function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
  return output;
}

function doPost(e) {
  const spreadsheetId = "1SoLN-vWqgzXrTz2-Y3VA3G67otJzohVuKKDKeICiKLA";
  const folderId = "1GklTgVYAroOH5K2q0le-grNxV61_Gkc9";

  try {
    const payload = JSON.parse(e.postData.contents);
    const filename = payload.filename || '';
    const csvData = payload.csv || '';

    if (!filename || !csvData) {
      throw new Error('Missing filename or CSV data');
    }

    //------------------------------------
    // Save CSV to Drive
    //------------------------------------
    const folder = DriveApp.getFolderById(folderId);
    folder.createFile(filename + ".csv", csvData, MimeType.CSV);

    //------------------------------------
    // Append to Master Sheet
    //------------------------------------
    const ss = SpreadsheetApp.openById(spreadsheetId);
    let masterSheet = ss.getSheetByName("Master");
    
    if (!masterSheet) {
      masterSheet = ss.insertSheet("Master", 0);
    }

    const rows = Utilities.parseCsv(csvData);

    // First file: write everything including header
    if (masterSheet.getLastRow() === 0) {
      masterSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    } else {
      // Later files: append data rows only (skip header)
      masterSheet.getRange(
        masterSheet.getLastRow() + 1,
        1,
        rows.length - 1,
        rows[0].length
      ).setValues(rows.slice(1));
    }

    //------------------------------------
    // Create Individual Participant Sheet
    //------------------------------------
    // Extract participant ID and session from filename
    // Expected format: "SWELDERS_16_Session1_participant123_1717934567890"
    var parts = filename.split('_');
    var ptcId = parts[3] || 'unknown';
    var sessionInfo = parts[1] + '_' + parts[2]; // e.g., "16_Session1"
    var sheetName = ptcId + '_' + sessionInfo; // e.g., "participant123_16_Session1"

    // Get or create individual participant sheet
    let individualSheet = ss.getSheetByName(sheetName);
    if (!individualSheet) {
      individualSheet = ss.insertSheet(sheetName);
    }

    // Append data to individual sheet
    if (individualSheet.getLastRow() === 0) {
      individualSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    } else {
      individualSheet.getRange(
        individualSheet.getLastRow() + 1,
        1,
        rows.length - 1,
        rows[0].length
      ).setValues(rows.slice(1));
    }

    //------------------------------------
    // Return Success Response
    //------------------------------------
    var output = ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "CSV saved to Drive and data appended to Master and individual sheets",
        individualSheet: sheetName,
        rowsAdded: rows.length - 1
      }))
      .setMimeType(ContentService.MimeType.JSON);
    output.addHeader('Access-Control-Allow-Origin', '*');
    output.addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
    return output;

  } catch (err) {
    var output = ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    output.addHeader('Access-Control-Allow-Origin', '*');
    output.addHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
    return output;
  }
}
