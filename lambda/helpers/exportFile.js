var exportFile = function(googleapi, accessToken,oauth2Client, fileid){
	oauth2Client.setCredentials({access_token: accessToken})
	var drive = googleapi.drive({version: 'v3', auth: oauth2Client})
	return new Promise(function(resolve, reject){
		drive.files.export({
			fileId: fileid,
			mimeType: 'text/plain'
		}, function(err, res){
			if(err){
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}

module.exports = exportFile;