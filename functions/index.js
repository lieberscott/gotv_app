const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require("nodemailer");

admin.initializeApp();

require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = (from, to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) {
        reject(err);
      } // unsure what to do here! error message: could not send verification email, please try again later
      else {
        resolve(info)
      }
    });
  });
}

exports.sendEmailNotification = functions.firestore.document("campaigns/{docId}")
.onCreate(async (snap, ctx) => {
  const data = snap.data();
  console.log("data : ", data);

  // let authData = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.SENDER_EMAIL,
  //     pass: process.env.SENDER_PASSWORD
  //   }
  // })

  let html = `<p>Please confirm your account by clicking <a href='google.com'>here</a>.</p><p>New Poll:</p><p>MongoDB id : ${id}</p><p>candidates: ${candidates}</p><p>poll_id: ${poll_id}</p><p>Area Code : ${area_code}</p>`

  try {
    await sendEmail("welcome@undecidedapp.com", `#{ data.email }`, "Please confirm your account", html);
    await sendEmail("newcampaign@undecidedapp.com", process.env.MY_EMAIL, "A new campaign has signed up", html);
    return res.json({ success: "Poll has been submitted and will be ready within 24 hours. You will receive an email when it is ready.", poll_id: poll_id })
  }
  catch (email_err) {
    console.log(email_err);
    return res.json({ error: "Unable to complete poll. Please contact Readout Consult at www.readoutconsult.com/contact." })
  }
});
