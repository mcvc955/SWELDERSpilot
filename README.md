# SWELDERS Cognitive Tasks Study

A jsPsych-based online study implementing multiple cognitive tasks (Reaction Time, Face-Name Association, Trail Making Test) with automated data collection to Google Sheets.

## Tasks Included

- **Simple RT (Stoplight) Task**: Participants respond to colored lights (green = press P, red = press Q, off = no response)
- **Face Familiarization**: Passive exposure to 16-32-64 faces
- **Face-Name Learning**: Associates faces with names, includes mastery testing
- **Trail Making Test (TMT)**: Sequence completion (1→A→2→B→3→C...) with error tracking

## Study Variants

- **SWELDERS16**: 16 faces (Session 1 & 2)
- **SWELDERS32**: 32 faces (Session 1 & 2)
- **SWELDERS64**: 64 faces (Session 1 & 2)

## Google Sheets Integration

All session data automatically saves to Google Sheets via a custom Google Apps Script.

### Setup

1. **Create a Google Sheet** at https://sheets.google.com
   - Note your **Spreadsheet ID** from the URL

2. **Deploy Google Apps Script**
   - Go to https://script.google.com
   - Create new project, paste code from `google_apps_script_doPost.js`
   - Replace `REPLACE_SPREADSHEET_ID` with your actual ID
   - Deploy as Web App (Execute as: You, Access: Anyone)
   - Copy the deployment URL

3. **Update Session Files**
   - Replace `REPLACE_YOUR_ID_HERE` in all session HTML files with your deployment ID

### Data Structure

**Master Sheet** (all participant data, flattened):
- Timestamp | Participant_ID | Session | Filename | trial | response | rt | correct | ...

**Individual Sheets** (one per participant-session):
- Separate sheet for each participant's session data (e.g., `participant123_RT_Session1`)

### CSV Parsing

The Apps Script automatically:
- Parses jsPsych CSV data into individual rows
- Extracts participant ID from the filename
- Creates per-participant sheets on first submission
- Prevents data overwrites (appends to new rows)

## Session Files

| File | Description |
|------|-------------|
| `SWELDERS_Session1.html` | Full session (all tasks) |
| `SWELDERS16/32/64_Session1/2.html` | Stimulus set variants |
| `FaceNameRelationshipTask.html` | Face-name task only |
| `Simple RT Task.html` | RT task only |
| `FN_Task_16/32/64.html` | Face-name variants |
| `TMT_SRTTbuttonplugin.html` | TMT task only |

## jsPsych Configuration

- **Fullscreen mode**: Required before main task
- **Progress bar**: Visible throughout
- **Override safe mode**: Enabled for local testing
- **Data collection**: Automatic via `jsPsych.data.get().csv()`

## Running the Study

1. Open any session HTML in a browser
2. Enter participant ID when prompted
3. Allow fullscreen when requested
4. Complete all tasks
5. Data automatically posts to Google Sheets on completion

## Troubleshooting

**Data not saving?**
- Check browser console (F12) for fetch errors
- Verify Google Apps Script deployment URL is correct
- Ensure deployment has "Anyone" access

**Missing participant sheets?**
- First submission creates individual sheet automatically
- Check Master sheet for all participant data

**Filename parsing issues?**
- Expected format: `SWELDERS_RT_Session1_participant123_1717934567890`
- Apps Script extracts parts[3] as participant ID

## Stimulus Files

- Faces: `FNR_64/faces/AllFaces/` (32 faces used)
- RT stimuli: `RTStimuli/` (GreenLight.png, RedLight.png, LightsOff.png)

## Contact & Attribution

Built with jsPsych (https://www.jspsych.org/)  
Study data saved to Google Sheets via custom Apps Script

---

**Last Updated**: June 2026  
**Google Apps Script Deployment**: https://script.google.com/macros/s/AKfycbyzRSkOmjZk5vdQJgKJl3Q7CjyC8v2WduYAYF2cOzrGxx9EVzSl8Ng9noyDrOrJZQiI7A/exec
