# node-sendmail

Send mail without SMTP server

### Install

    npm install sendmail

### Options

```
var sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  }
})
```

* `logger` customized logger.
* `silent`  silent mode

### Usage

```javascript
var sendmail = require('sendmail')();

sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'test@qq.com, test@sohu.com, test@163.com ',
    subject: 'test sendmail',
    content: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
```
