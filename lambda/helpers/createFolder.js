var createFolder = function(googleapi, accessToken,oauth2Client, folderMetadata){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	return new Promise(function(resolve, reject){
		drive.files.create({
			resource: folderMetadata,
			fields: 'id'
		}, function(err, file){
			if(err){
				reject(err)
			} else {
				resolve(file)
			}
		})
	})
}

module.exports = createFolder