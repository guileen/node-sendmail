var fs = require('fs')
var path = require('path')
var sendmail = require('../sendmail')({
  silent: true,
  dkim: {
    privateKey: fs.readFileSync(path.join(__dirname, './dkim-private.pem'), 'utf8'),
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
