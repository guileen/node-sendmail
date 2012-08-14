var sendmail = require('../').sendmail;

var arr = []
  , inspect = require('util').inspect
//should only see INFO or above
sendmail.log = 
      { emit : 
          function(l, args) { 
            console.log(l + ":" + 
              map.call(args, function(v,i){ //handle arbitrary number of arguments
                return i && v ? //first argument (index zero) should always be a string and should not go through inspect
                 ( v.stack ? 
                      v.stack : 
                      inspect(v) ) 
                 : v 
              }).join(" "))  
          },
        debug: function(){ this.emit( colorize("[cyan]{DEBUG}" ),arguments ) },
        info : function(){ this.emit( colorize("[green]{INFO}"    ),arguments ) },
        warn : function(){ this.emit( colorize("[yellow]{WARN}"),arguments ) },
        error: function(){ this.emit( colorize("[red]{ERROR}"     ),arguments ) },
        fatal: function(){ this.emit( colorize("[red]{FATAL}"     ),arguments ) }
      };

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


function colorize(str) {
    return str.replace(/\[(\w+)\]\{([^]*?)\}/g
      , function(_, color, str) {
            return '\x1B[' + colorize.colors[color] + 'm' + str + '\x1B[0m';
        }
    );
}
colorize.colors = { bold: 1, red: 31, green: 32, yellow: 33, purple: 35, cyan: 36 };
