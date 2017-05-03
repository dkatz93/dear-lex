var Alexa = require('alexa-sdk');

var constants = require('../constants');

var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
	'NewSession': function () {
    var name = this.attributes['userName'];
    if (name) {
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
      this.emit(':ask', 'Welcome to Dear Lex. The skill that allows you to manage your daily journal', 'Tell me your name by saying: My name is, and then your name.');
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
      this.emit(':ask', `Ok ${name}! Tell me if you would like to create a journal, create an entry or have me read you a prior entry.`, `What would you like to do?`);
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