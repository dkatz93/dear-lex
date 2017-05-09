var Alexa = require('alexa-sdk');
var google = require('googleapis');

var oauth2Client = require('../helpers/auth')
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
    		this.emit(':ask', 'Welcome to Dear Lex. The skill that allows you to manage your daily journal. I will create a folder in your google drive where you will be able to see your journal entries once you tell me your name', 'Tell me your name by saying: My name is, and then your name.');
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
     	// creates a folder in google drive for alexa journal
      var folderMetadata = {
  			'name' : 'Dear-Lex',
  			'mimeType' : 'application/vnd.google-apps.folder'
  		};
  		var accessToken = this.event.session.user.accessToken;
  		oauth2Client.setCredentials({access_token: accessToken})
  		var drive = google.drive({
  			version: 'v3',
  			auth: oauth2Client
  		})
  		drive.files.create({
  			resource: folderMetadata,
  			fields: 'id'
  		}, function(err, file){
  			if(err){
  				console.log(err);
  			} else {
  				console.log('file.id', file.id)
  				this.attributes['folderID'] = file.id;
  			}
  		})
      this.emit(':ask', `Ok ${name}! I have created a folder in google drive called Dear Lex where you can manage your journal. Tell me if you would like to create a journal, create an entry or have me read you a prior entry.`, `What would you like to do?`);
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