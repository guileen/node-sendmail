var fs=require("fs");
var sendmail = require('sendmail')({
    tls:{
		cert:fs.readFileSync("cert.pem"),
		key:fs.readFileSync("key.pem"),
	}
})

sendmail({
  from: 'test@yourdomain.com',
  to: 'info@yourdomain.com',
  replyTo: 'jason@yourdomain.com',
  subject: 'MailComposer sendmail',
  html: 'Mail of test sendmail '
}, function (err, reply) {
  console.log(err && err.stack)
  console.dir(reply)
})