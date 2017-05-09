var listFiles = function(googleapi, accessToken,oauth2Client, qData){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	return new Promise(function(resolve, reject){
		drive.files.list({
			q: qData,
			fields: 'files(id, name)',
			spaces: 'drive'
		}, function(err, res){
			if(err){
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}

module.exports = listFiles;