
var express = require('express');
var config = require('./config/default.js');
var pkg = require('./package');
var path = require('path');
var router = require('./router');
var httpProxy = require('http-proxy');
var util = require('util');
var colors = require('colors');
var cerDir = path.join(__dirname, 'config', 'cer');
var fs = require('fs');
var https = require('https');
var http = require('http');
var mitmproxy = require('node-mitmproxy');

var app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//启动代理服务器
var targetHost = config.schema + config.host + ':' + config.port;
console.log(targetHost);

var httpsOption = {
    cert: fs.readFileSync(path.join(cerDir, 'client-cert.pem'), 'utf8'),
    key: fs.readFileSync(path.join(cerDir, 'client-key.pem'), 'utf8')
}


// 监听端口，启动程序
app.listen(config.port, function (err) {
    if (err){
       console.log(err);
    }else{
        console.log(`${pkg.name} start success! listening on port ${config.port}`);
        startProxy();
    }

});

var agentHosts = config.agentHosts;

var startProxy = function(){
    mitmproxy.createProxy({
        port: config.agentPort,
        sslConnectInterceptor: function(req, cltSocket, head) { //判断该connnect请求是否需要代理
            var hostName = req.headers.host;
            var isAgent = agentHosts.indexOf(hostName) !== -1;
            return isAgent;
        },
        requestInterceptor: function (rOptions, req, res, ssl, next){ //拦截客户端请求/响应
            var hostName = rOptions.hostname;
            router(req, res , ssl, next);
        },
        responseInterceptor: function(req, res, proxyReq, proxyRes, ssl, next)  { //拦截服务端请求/响应
            next();
        }
    });
}







