# node-sendmail

Send mail without SMTP server

### Install

    npm install sendmail

### Usage

```javascript
sendmail = require('sendmail').sendmail;

sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'test@qq.com, test@sohu.com, test@163.com ',
    subject: 'test sendmail',
    content: 'Mail of test sendmail ',
  }, function(err, receipient) {
    console.log(err && err.stack);
    console.dir(receipient);
});
```

Note that the callback function will be called for every receipient in separate.