var sendmail = require('../').sendmail;

sendmail(
  { from: 'test@yourdomain.com',
    to: 'test@qq.com, test@gmail.com, test@sohu.com, test@163.com ',
    subject:'test', 
    content:"abracadabra"
  }
, function(){ 
      console.log("send mail response", arguments);
  }
)