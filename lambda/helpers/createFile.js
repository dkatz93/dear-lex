var createFile = function(googleapi, accessToken,oauth2Client, fileMetadata, media){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	return new Promise(function(resolve, reject){
		drive.files.create({
			resource: fileMetadata,
			media: media,
			field: 'id'
		}, function(err, file){
			if(err){
				reject(err)
			} else {
				resolve(file)
			}
		})
	})
}

module.exports = createFile;