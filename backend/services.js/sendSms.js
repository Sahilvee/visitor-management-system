import twilio from "twilio";

//can't be implemented because in free trial version we also have to register the visitor number to send sms on site

export const sendSMS = async (
     phone=  "+917876761842",
        message="hi your appointent is booked check mailbox for rest details "
) => {
const accountSid =process.env.TWILIO_SID;

const authToken =process.env.TWILIO_AUTH_TOKEN;

  console.log("SID:", accountSid);
     console.log("TOKEN:", authToken);

const  client = twilio(accountSid,
  authToken
);
     try {

        const response =await client.messages.create({

        body: message,

        from:
            process.env.TWILIO_PHONE,

          to: phone,

      });

   console.log(response.sid);

  }  catch ( err) {

       console.log(err);

  }
};