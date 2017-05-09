var updateEntry = function(googleapi, accessToken,oauth2Client, fileid, date, entry){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	var doc = DocumentApp.openById(fileid)
	var body = doc.getBody();
	body.insertParagraph(entry).setHeading(date)
}

module.exports = updateEntry;