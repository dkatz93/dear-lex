var Alexa = require('alexa-sdk');

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
  		var folderID = this.attributes['folderID']
  		if(this.attributes[journalName]){
  			this.emit(':ask', `It looks like you already have a journal called ${journalName}. If  you would like to create an entry in this journal, you can say, record new entry in ${journalName} or pick a new name for the new journal.`,'What would you like to do?')
  		} else {
	  		var fileMetadata = {
	  			'title' : journalName,
	  			parents: [{id: folderID}]
	  		}
	  		drive.files.insert({
	  			resource: fileMetadata,
	  			field: 'id'
	  		}, function(err, file){
	  			if(err){
	  				console.log(err)
	  			} else {
	  				this.attributes[journalName] = file.id
	  			}
	  		})
	  	}
  	}

  },
  'ListAllJournals': function(){

  },
  'CreateEntry': function(){

  },
  'ReadEntry': function(){

  },
  'UpdateEntry': function(){

  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', `Goodbye ${name}! Have a fantastic day!.`);
  },

  'AMAZON.CancelIntent': function () {
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