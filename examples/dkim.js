var fs = require('fs')

var sendmail = require('../sendmail')({
  silent: true,
  dkim: {
    privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
    keySelector: 'mydomainkey'
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
