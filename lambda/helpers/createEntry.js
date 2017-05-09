var createEntry = function(googleapi, accessToken,oauth2Client, fileid, date, entry){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	return new Promise(function(resolve, reject){
		drive.files.update({
			fileId: fileid,
			media: {
				mimeType: 'text/plain',
				body: '\'' + date + ": \ " 
				 + entry
			}
		}, function(err, res){
			if(err){
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}

module.exports = createEntry;