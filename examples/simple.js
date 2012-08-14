sendmail = require('../sendmail')();

sendmail({
    from: 'test@yourdomain.com',
    to: 'test@qq.com, test@gmail.com, test@sohu.com, test@163.com ',
    subject: 'test sendmail',
    content: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});

