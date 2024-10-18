const { google } = require('googleapis');
require('dotenv').config();  

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

async function authenticate() {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uris = process.env.GOOGLE_REDIRECT_URI;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

    const TOKEN_PATH = path.join(__dirname, 'token.json');

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
    } else {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url:', authUrl);
       
    }
    return oAuth2Client;
}

async function updateEvent(auth, calendarId, eventId, updatedEvent) {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        resource: updatedEvent,
    });
    return res.data.htmlLink;
}

module.exports = {
    authenticate,
    updateEvent
};
