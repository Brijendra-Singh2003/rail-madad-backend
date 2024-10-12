import twilio from "twilio";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID as string;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioServiceSid = process.env.TWILIO_SERVICE_ID as string;

const client = twilio(twilioAccountSid, twilioAuthToken);

const twilioService = client.verify.v2.services(twilioServiceSid);

export default twilioService;
