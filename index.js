
var express = require('express');
var config = require('./config/default.js');
var pkg = require('./package');
var path = require('path');
var fs = require('fs');
var https = require('https');
var mitmproxy = require('node-mitmproxy');
var router = require('./router');

var app = express();

// 设置静态文件目录
app.use('static',express.static(path.join(__dirname, 'public')));

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
            if(!isAgent){
                console.log('No proxy ---> ' + hostName);
            }else{
                console.log('Proxy ---> ' + hostName);
            }
            return isAgent;
        },
        requestInterceptor: function (rOptions, req, res, ssl, next){ //拦截客户端请求/响应
            var hostName = req.headers.host;
            var isAgent = agentHosts.indexOf(hostName) !== -1;
            if(isAgent){
                router(req, res , ssl, next);
            }else{
                console.log('No proxy ----> ' + hostName);
                next();
            }

        },
        responseInterceptor: function(req, res, proxyReq, proxyRes, ssl, next)  { //拦截服务端请求/响应
            next();
        }
    });
}







