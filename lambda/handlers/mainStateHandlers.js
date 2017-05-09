var Alexa = require('alexa-sdk');
var google = require('googleapis')

var oauth2Client = require('../helpers/auth')
var constants = require('../constants');

var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
  	var name = this.attributes['userName'];
    if (name) {
      this.emit(':ask', `Welcome back to Dear Lex, ${name}! You can ask me to create a journal, create an entry or have me read you a prior entry.`, 'What would you like to do?');
    } else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
    }
  },
  'CreateNewJournal': function(){
  	var journalName = this.event.request.intent.slots.JournalName.value;
  	if(journalName){
  		//var folderID = this.attributes['folderID']
  		//later add something for if journal exists
			// this.emit(':ask', `It looks like you already have a journal called ${journalName}. If  you would like to create an entry in this journal, you can say, record new entry in ${journalName} or pick a new name for the new journal.`,'What would you like to do?');
			var accessToken = this.event.session.user.accessToken;
			oauth2Client.setCredentials({access_token: accessToken})
  		var drive = google.drive({
  			version: 'v3',
  			auth: oauth2Client
  		})

  		// var folderID = '';
  		// drive.files.list({
  		// 	auth: oauth2Client,
  		// 	q: 'mimeType = "application/vnd.google-apps.folder"',
  		// 	fields: 'nextPageToken, files(id, name)'
  		// }, function(err, res){
  		// 	if(err){
  		// 		console.log(err)
  		// 	} else{
  		// 		folderID = res.files[0].id
  		// 	}
  		// })
  		var fileMetadata = {
  			'name' : journalName,
  			'mimeType' : 'application/vnd.google-apps.document'
  		}
  		var media = {
  			'mimeType' : 'text/plain',
  			'body' : ''
  		}
  		drive.files.create({
  			resource: fileMetadata,
  			media: media,
  			field: 'id'
  		}, function(err, file){
  			if(err){
  				console.log(err);
  			} else {
  				console.log(file.id)
  			}
  		})
  		this.emit(':ask', `I successfully created your journal, ${journalName}`, `'What would you like to do now?'`);
  	} else {
  		this.emit(':ask', `Sorry, I didn\'t hear the name you wanted for your new journal`, `Try to create a new journal again, please.`);
  	}
  },
  'ListAllJournals': function(){
  	// var folderID = this.attributes['folderID']
  	// drive.files.list({
	  //   parents:[{id:folderID}]
	  // }, function(err, res) {
	  //   if(err) {
	  //     callback(err);
	  //   } else {
	  //   	var fileList = [];
	  //     res.files.forEach(function(file) {
	  //       console.log('Found file: ', file.name, file.id);
	  //       fileList.push(file.name)
	  //     });
	  //     var journalList = '';
	  //     for(var i = 0; i < fileList.length; i ++){
	  //     	if(i == fileList.length - 1){
	  //     		journalList += and fileList[i]
	  //     	}
	  //     	else{
	  //     		journalList += fileList[i] + ", "
	  //     	}
	  //     }
	      this.emit(':ask', `The journals that you have are ${journalList}. You can create an entry in one of these journals or ask me to read an entry to you`,'What would you like to do?')
	  //   }
	  // });
	},
  'CreateEntry': function(){

  },
  'ReadEntry': function(){

  },
  'UpdateEntry': function(){

  },
  'AMAZON.StopIntent': function () {
  	var name = this.attributes['userName'];
    this.emit(':tell', `Goodbye ${name}! Have a fantastic day!.`);
  },

  'AMAZON.CancelIntent': function () {
  	var name = this.attributes['userName'];
    this.emit(':tell', `Goodbye ${name}! Have a fantastic day!`);
  },

  'SessionEndedRequest': function () {
    this.emit(':saveState', true);
  },
  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can ask me to create a journal, create an entry or have me read you a prior entry.`,  `What would you like to do?`);
  },
  'Unhandled' : function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = mainStateHandlers;