var Alexa = require('alexa-sdk');
var google = require('googleapis')

var oauth2Client = require('../helpers/auth');
var createFile = require('../helpers/createFile');
var listFiles = require('../helpers/listFiles');
var createEntry = require('../helpers/createEntry');
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
  },'CreateNewJournal': function(){
    var journalName = this.event.request.intent.slots.JournalName.value;
    if(journalName){
      var accessToken = this.event.session.user.accessToken;
      var fileMetadata = {
        'name' : 'Dear-Lex-'+journalName,
        'mimeType' : 'application/vnd.google-apps.document'
      }
      var media = {
        'mimeType' : 'text/plain',
        'body' : ''
      }
      createFile(google, accessToken, oauth2Client, fileMetadata, media)
        .then(file=> console.log(file.id))
      this.emit(':ask', `I successfully created your journal, ${journalName}`, `'What would you like to do now?'`);
    } else {
      this.emit(':ask', `Sorry, I didn\'t hear the name you wanted for your new journal`, `Try to create a new journal again, please.`);
    }
  },
  'ListAllJournals': function(){
    var q = "name contains 'Dear-Lex'";
    var accessToken = this.event.session.user.accessToken;
    listFiles(google, accessToken, oauth2Client, q)
    .then((res)=> {
      var fileList = [];
      res.files.forEach(function(file) {
        console.log('Found file: ', file.name, file.id);
        fileList.push(file.name.slice(8))
      });
      var journalList = '';
      for(var i = 0; i < fileList.length; i ++){
        if(i == fileList.length - 1){
          journalList += "and" + fileList[i]
        }
        else{
          journalList += fileList[i] + ", "
        }
      }
      this.emit(':ask', `The journals that you have are ${journalList}. You can create an entry in one of these journals or ask me to read an entry to you`,'What would you like to do?');
    })
    .catch(error => {
      this.emit(':tell', 'Sorry, there was an error.');
    })
	},
  'CreateEntry': function(){
    var entry = this.event.request.intent.slots.JournalEntry.value;
    var accessToken = this.event.session.user.accessToken;
    var date = new Date().toLocaleDateString()
    var generalFolderID = this.attributes['journalID']
    createEntry(google, accessToken, oauth2Client, generalFolderID, date, entry)
    .then(res => {
      console.log(res)
      this.emit(':tell', 'I successfully created a journal entry for you')
    })
    .catch(error => {
      this.emit(':tell', `Sorry, there was an error ${error}.`);
    })
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