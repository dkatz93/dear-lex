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