var sendmail = require('../sendmail')({
    devHost:'localhost',
    devPort: 1025
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