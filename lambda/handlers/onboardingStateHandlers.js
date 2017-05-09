var Alexa = require('alexa-sdk');
var google = require('googleapis');

var oauth2Client = require('../helpers/auth')
var createFolder = require('../helpers/createFolder');
var createFile = require('../helpers/createFile');
var constants = require('../constants');

var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
	'NewSession': function () {
    var name = this.attributes['userName'];
    if (name) {
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
    	var accessToken = this.event.session.user.accessToken;
    	if(accessToken){
    		oauth2Client.setCredentials({access_token: accessToken})
    		this.emit(':ask', 'Welcome to Dear Lex. The skill that allows you to manage your daily journal. I will create a file in your google drive where you will be able to see your journal entries once you tell me your name', 'Tell me your name by saying: My name is, and then your name.');
    	} else {
    		this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your alexa app.');
    	}
    }
  },
   'NameCapture': function () {
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }
    if (name) {
      this.attributes['userName'] = name;
     	
  		this.handler.state = constants.states.MAIN; 
  		var accessToken = this.event.session.user.accessToken;
  		var fileMetadata = {
        'name' : 'Dear-Lex-General',
        'mimeType' : 'application/vnd.google-apps.document'
      }
      var media = {
        'mimeType' : 'text/plain',
        'body' : ''
      }
  		createFile(google, accessToken, oauth2Client, fileMetadata, media)
  		.then(res => {
  			this.attributes['journalID'] = res.id;
  			this.emit(':ask', `Ok ${name}! I have created a file in google drive called Dear Lex General where you can view your journal. Tell me if you would like to create a journal, create an entry or have me read you a prior entry.`, `What would you like to do?`);
  		})
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise that name!`, `'Tell me your name by saying: My name is, and then your name.'`);
    }
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Goodbye!');
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

module.exports = onboardingStateHandlers;