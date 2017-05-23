
var express = require('express');
var config = require('./config/default.js');
var pkg = require('./package');
var path = require('path');
var router = require('./router');
var httpProxy = require('http-proxy');
var util = require('util');
var colors = require('colors');

var app = express();

//设置路由
router(app);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));




//启动代理服务器
var targetHost = config.schema + config.host + ':' + config.port;
console.log(targetHost);

var proxy = httpProxy.createServer({
    target:targetHost
}).listen(config.agentPort);

global.proxy = proxy;
util.puts('HTTP Proxy'.bold.green);

util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + String(config.agentPort).yellow);
util.puts('http server '.blue + 'started '.green.bold + 'on port '.blue + String(config.port).yellow);


// 监听端口，启动程序

app.listen(config.port, function (err) {
    if (err){
       console.log(err);
    }else{
        console.log(`${pkg.name} start success! listening on port ${config.port}`);
    }

});


