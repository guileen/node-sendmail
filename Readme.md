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

### Set of log level

```javascript

var sendmail = require('sendmail').sendmail

sendmail.log.level = 'INFO'

sendmail({ ...do your stuff... });

```


### Inject logger of your choice 
logger shold implement standard ILogger - i.e #debug, #info, #warn, #error, #fatal

```javascript

var sendmail = require('sendmail').sendmail,
    logger   = require('log4js').getLogger('my test logger');
   


sendmail.log = logger;

sendmail({ ...do your stuff... });

```
