exports.handler = async function(context, event, callback) {
  console.log(event);
  
	const twiml = new Twilio.twiml.VoiceResponse();
  const call = await context.getTwilioClient().calls(event.CallSid).fetch();
  
  const timeDiff = Math.abs(new Date() - call.dateCreated);
  var isWaitingTooLong = Math.floor(timeDiff/1000) > 30; //waiting for more than 30 seconds
  console.log(`${call.sid}: ${call.dateCreated} ${isWaitingTooLong}`);
  
  if (isWaitingTooLong) {
    //say a message and return and hang up the call
    twiml.say({voice: 'woman'}, 'Thank you for your call. No agents available');
    twiml.hangup();
    return callback(null, twiml);
  } else {
    //redirect to the same function
    twiml.redirect(context.QUEUE_WAITING_URL);
  }
  
  return callback(null, twiml);
};
