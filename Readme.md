[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![npm-issues][npm-issues-image]][npm-issues-url]
[![js-standard-style][standard-image]][standard-url]

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[npm-image]: https://img.shields.io/npm/v/sendmail.svg?style=flat
[npm-url]: https://npmjs.org/package/sendmail
[downloads-image]: https://img.shields.io/npm/dt/sendmail.svg?style=flat
[downloads-url]: https://npmjs.org/package/sendmail
[npm-issues-image]: https://img.shields.io/github/issues/guileen/node-sendmail.svg
[npm-issues-url]: https://github.com/guileen/node-sendmail/issues
# node-sendmail

Send mail without SMTP server

### Install

    npm install sendmail --save

### Options

```javascript
var sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  },
  silent: false,
  dkim: { // Default: False
    privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
    keySelector: 'mydomainkey'
  },
  devPort: 1025 // Default: False
})
```

### Usage

```javascript
var sendmail = require('sendmail')();

sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'test@qq.com, test@sohu.com, test@163.com ',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
```
### Examples

Please checkout our great examples
- **[attachmentFile.js](https://github.com/guileen/node-sendmail/blob/master/examples/attachmentFile.js)**
- **[developmentMode.js](https://github.com/guileen/node-sendmail/blob/master/examples/developmentMode.js)**
- **[dkim.js](https://github.com/guileen/node-sendmail/blob/master/examples/dkim.js)**
- **[meetingRequest.js](https://github.com/guileen/node-sendmail/blob/master/examples/meetingRequest.js)**
- **[simple.js](https://github.com/guileen/node-sendmail/blob/master/examples/simple.js)**

### Upgrading

Note if you were on any previous version before `<1.0.0` You will need to start using `html` instead of `content`. Instead of creating emails ourselves anymore we have decided to use `mailcomposer` to compose our emails. Which means we can give you the same great package with the best mail composer package out there. 

### Mail Options
Note we use `mailcomposer` to compose our mail before we send it out so all mail options will be well documented [Here](https://github.com/nodemailer/mailcomposer). But for those who want something particular go ahead and search down below.

##### E-mail message fields 
Below are a list of the most used options for email fields. Please read the entire list of options here [Here](https://github.com/nodemailer/mailcomposer#e-mail-message-fields):

  - **from** 
  - **sender** 
  - **to** 
  - **cc** 
  - **bcc**
  - **replyTo**
  - **inReplyTo**
  - **subject**
  - **text**
  - **html**
  
##### Attachments
You are also able to send attachents. Please review the list of properties here [Here](https://github.com/nodemailer/mailcomposer#attachments)



##### Alternatives
In addition to text and HTML, any kind of data can be inserted as an alternative content of the main body. Please check that out [Here](https://github.com/nodemailer/mailcomposer#alternatives)


##### Address Formatting

All e-mail addresses can be formatted. Please check that out [Here](https://github.com/nodemailer/mailcomposer#address-formatting)


##### SMTP envelope

SMTP envelope is usually auto generated from `from`, `to`, `cc` and `bcc` fields but you can change them [Here](https://github.com/nodemailer/mailcomposer#smtp-envelope)

##### Using Embedded Images

Attachments can be used as embedded images in the HTML body. To use this feature, you need to set additional properties [Here](https://github.com/nodemailer/mailcomposer#using-embedded-images)



### Questions, Comments & Concerns

Please reach out to [Green Pioneer](https://github.com/greenpioneer). [Guileen](https://github.com/guileen) is the original creator.

### Change Log

##### 1.0.0 Mail Composer
A better way to compose the emails while still sending them out in the exact same way.

##### 1.1.0 Support for development SMTP
A property describing a port for a local SMTP server (see [MailHog](https://github.com/mailhog/MailHog)) was added. If the property is omitted, sendmail behaves like it used to. This feature makes it possible to test an application offline and for multiple email addresses without needing to create hundreds of mail accounts. - Special thanks goes out to  gumannp for [PR 21](https://github.com/guileen/node-sendmail/pull/21)

##### 1.1.0 Add DKIM signing
Added a `dkim` object to options that can have two properties: `privateKey` and `keySelector`. These options correspond to the options for [`dkim-signer`](https://github.com/andris9/dkim-signer). Added an example for these options. Special thanks goes out to download13 for [PR 23](https://github.com/guileen/node-sendmail/pull/23)


### Roadmap

* Add Testing
* Please submit what you think should be in the plan
