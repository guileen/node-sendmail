var inspect = require('util').inspect
    tcp = require('net'),
    dns = require('dns'),
    CRLF = '\r\n';

//implement a default minimal conventional logger, based on console
//logger implements ILog standard 
//(to allow injecting a configuratble 3rd-party ILog like `log4js`, log4node`, `winston`, etc.)
//implement using a closure. If log injected - all closure will be garbage-collected
var log = 
(function(){  
  var level = 0,
      levels = ("DEBUG,INFO,WARN,ERROR,FATAL").split(",")
      map = Array.prototype.map,
      logger = 
      { emit : 
          function(l, args) { 
            if (l < level) return; //standard filter by level 
            console.log(levels[l] + ":" + 
              map.call(args, function(v,i){ //handle arbitrary number of arguments
                return i && v ? //first argument (index zero) should always be a string and should not go through inspect
                 ( v.stack ? 
                      v.stack : 
                      inspect(v) ) 
                 : v 
              }).join(" "))  
          },
        debug: function(){ this.emit(0,arguments ) },
        info : function(){ this.emit(1,arguments ) },
        warn : function(){ this.emit(2,arguments ) },
        error: function(){ this.emit(3,arguments ) },
        fatal: function(){ this.emit(4,arguments ) },
        levels: levels
      };
  logger.__defineGetter__("level", function(){ return levels[level] });
  logger.__defineSetter__("level", function(strLevel){ 
    var iLevel = levels.indexOf(strLevel.toUpperCase());
    if (iLevel == -1) return console.log(strLevel + " is not a level");
    level = iLevel;
  })
  return logger;
})()

//define getters and setter to allow inject or reuse existing logger
sendmail.__defineGetter__("log", function(){ return log });
sendmail.__defineSetter__("log", function(oLog){ log = oLog });

/*
 *   邮件服务返回代码含义
 *   500   格式错误，命令不可识别（此错误也包括命令行过长）
 *   501   参数格式错误
 *   502   命令不可实现
 *   503   错误的命令序列
 *   504   命令参数不可实现
 *   211   系统状态或系统帮助响应
 *   214   帮助信息
 *   220   服务就绪
 *   221   服务关闭传输信道
 *   421   服务未就绪，关闭传输信道（当必须关闭时，此应答可以作为对任何命令的响应）
 *   250   要求的邮件操作完成
 *   251   用户非本地，将转发向
 *   450   要求的邮件操作未完成，邮箱不可用（例如，邮箱忙）
 *   550   要求的邮件操作未完成，邮箱不可用（例如，邮箱未找到，或不可访问）
 *   451   放弃要求的操作；处理过程中出错
 *   551   用户非本地，请尝试
 *   452   系统存储不足，要求的操作未执行
 *   552   过量的存储分配，要求的操作未执行
 *   553   邮箱名不可用，要求的操作未执行（例如邮箱格式错误）
 *   354   开始邮件输入，以.结束
 *   554   操作失败
 *   535   用户验证失败
 *   235   用户验证成功
 *   334   等待用户输入验证信息
 */

function getHost(email) {
  var m = /[^@]+@([\w\d\-\.]+)/.exec(email);
  return m && m[1];
}

function group_recipients(recipients) {
  var groups = {}, email, host, i = 0;
  for (; i < recipients.length; i++) {
    host = getHost(recipients[i]);
    (groups[host] || (groups[host] = [])).push(recipients[i]);
  }
  return groups;
}

/**
 * connect to domain by Mx record
 */
function connectMx(domain, callback) {
  dns.resolveMx(domain, function(err, data) {  
      if (err) { 
          log.error("Error on resolveMx: " + err.stack);
          return callback(err);
      }

      data.sort(function(a, b) {return a.priority < b. priority});
      log.info("mx resolved: ", data);

      if (!data || data.length == 0) {  
        err = new Error('can not resolve Mx of <' + domain + '>');
        log.error(e.stack);
        return callback(err);
      }

      function tryConnect(i) {

        if (i >= data.length) { 
           err = new Error('can not connect to any SMTP server');
           log.error(e.stack);
           return callback(err);
        }

        var sock = tcp.createConnection(25, data[i].exchange);

        sock.on('error', function(err) {
            log.error("Error on connectMx for: ", data[i], err);
            tryConnect(++i);
        });

        sock.on('connect', function() { 
            log.debug("MX connection created: ", data[i].exchange);
            sock.removeAllListeners('error');
            callback(null, sock);
        });

      };

      tryConnect(0);
  });
}

function sendToSMTP(domain, srcHost, from, recipients, body, cb) {
  var callback=(typeof cb=='function') ? cb : function(){};
  connectMx(domain, function(err, sock) {
      if(err){ 
        log.error("error on connectMx", err.stack);
        return callback(err);
      }

      function w(s) {
        log.debug('write to socket: ', s);
        sock.write(s + CRLF);
      }

      sock.setEncoding('utf8');

      sock.on('data', function(chunk) {
          data += chunk;
          parts = data.split(CRLF);
          for (var i = 0, len = parts.length - 1; i < len; i++) {
            on_line(parts[i]);
          }
          data = parts[parts.length - 1];
      });

      sock.on('error', function(err) {
          log.error("error on connectMx socket", err);
          callback(err);
      });

      var data = '', step = 0, loginStep = 0, queue = [], login = [], parts, cmd;

      /*
      if(mail.user && mail.pass){
        queue.push('AUTH LOGIN');
        login.push(new Buffer(mail.user).toString("base64"));
        login.push(new Buffer(mail.pass).toString("base64"));
      }
      */

      queue.push('MAIL FROM:<' + from + '>');
      for (var i = 0; i < recipients.length; i++) {
        queue.push('RCPT TO:<' + recipients[i] + '>');
      }
      queue.push('DATA');
      queue.push('QUIT');

      function response(code, msg) {
        switch (code) {
        case 220:
          //*   220   on server ready
          //*   220   服务就绪
          if (/\besmtp\b/i.test(msg)) {
            // TODO:  determin AUTH type; auth login, auth crm-md5, auth plain
            cmd = 'EHLO';
          } else {
            cmd = 'HELO';
          }
          w(cmd + ' ' + srcHost);
          break;

        case 221: // bye
        case 235: // verify ok
        case 250: // operation OK
        case 251: // foward
          if (step == queue.length) { 
            log.info("OK:", code, msg);
            callback(null, recipients);
          }
          w(queue[step]);
          step++;
          break;

        case 354: // start input end with . (dot)
          log.info("sending mail", body);
          w(body);
          w('');
          w('.');
          break;

        case 334: // input login
          w(login[loginStep]);
          loginStep++;
          break;

        default:
          if (code >= 400) { 
            log.warn("SMTP responds error code", code);
            callback(code, msg);
            sock.end();
          }
        }
      }

      var msg = '';
      function on_line(line) {
        msg += (line + CRLF);

        if (line[3] === ' ') {
          // 250-information dash is not complete.
          // 250 OK. space is complete.
          log.debug('message from socket: ' + msg);
          response(parseInt(line), msg);
          msg = '';
        }
      }
  });
}

function getAddress(address){
  return address.replace(/^.+</,'').replace(/>\s*$/,'').trim();
}

function getAddresses(addresses) {
  var i, m, address, results = [];
  if (!Array.isArray(addresses)) {
    addresses = addresses.split(',');
  }
  for(i=0;i<addresses.length;i++){
    results.push(getAddress(addresses[i]));
  }
  return results;
}

/**
 * sendmail directly
 *
 * @param mail {object}
 *             from
 *             to
 *             cc
 *             bcc
 *             replyTo      TODO
 *             returnTo     TODO
 *             subject
 *             type         default 'text/plain', 'text/html'
 *             charset      default 'utf-8'
 *             encoding     default 'base64'
 *             id           default timestamp+from
 *             headers      object
 *             content
 *             attachments  TODO
 *               [{
 *                 type
 *                 filename
 *                 content
 *               }].
 *
 * @param callback function(err, domain).
 *
 */
function sendmail(mail, callback) {
  var recipients = [], groups, srcHost, data, lheader;
  if (mail.to) {
    recipients = recipients.concat(getAddresses(mail.to));
  }

  if (mail.cc) {
    recipients = recipients.concat(getAddresses(mail.cc));
  }

  if (mail.bcc) {
    recipients = recipients.concat(getAddresses(mail.bcc));
  }

  groups = group_recipients(recipients);

  from = getAddress(mail.from);
  srcHost = getHost(from);

  data = 'From: ' + mail.from + CRLF;
  if (mail.to) {
    data += 'To: ' + (Array.isArray(mail.to) ? mail.to.join(',') : mail.to);
    data += CRLF;
  }
  if (mail.cc) {
    data += 'Cc: ' + Array.isArray(mail.cc) ? mail.cc.join(',') : mail.cc;
    data += CRLF;
  }

  data += 'Subject: ' + mail.subject + CRLF;
  data += 'MIME-Version: ' + (mail.version || '1.0') + CRLF;
  data += 'Message-ID: <' + (mail.id || (new Date().getTime() + srcHost)) + '>' + CRLF;
  data += 'Content-Type: ' + (mail.type || 'text/plain');
  data += '; charset=\"' + (mail.charset || (mail.charset = 'utf-8')) + '\"' + CRLF;
  data += 'Content-Transfer-Encoding: ' + (mail.encoding || (mail.encoding = 'base64')) + CRLF;
  for (var name in mail.headers) {
    data += name + ': ' + mail.headers[name] + CRLF;
  }

  data += CRLF;

  content = mail.content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  data += new Buffer(content).toString('base64');

  for (var domain in groups) {
    sendToSMTP(domain, srcHost, from, groups[domain], data, callback);
  }

}

exports.sendmail = sendmail;
