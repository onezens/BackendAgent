
var express = require('express');
var config = require('./config/default.js');
var pkg = require('./package');
var path = require('path');
var fs = require('fs');
var https = require('https');
var mitmproxy = require('node-mitmproxy');
var router = require('./router');
var httpProxy = require('http-proxy');
var http = require('http');
var debugLog = require('debug')('BA:index');


var proxy = httpProxy.createProxyServer();

var reqNum  = 0; // 缓存目前请求的数量

proxy.on('proxyReq',function () {
    reqNum ++;
    console.log("发起一个请求,当前的剩余的请求数量是 " + reqNum);
});


proxy.on('proxyRes',function () {
    reqNum --;
    console.log("完成一个请求,当前的剩余的请求数量是 " + reqNum);
});


// 监听端口，启动程序
var agentHosts = config.agentHosts;

var startProxy = function(){
    mitmproxy.createProxy({
        port: config.agentPort,
        sslConnectInterceptor: function(req, cltSocket, head) { //判断该connnect请求是否需要代理
            return true;
            var hostName = req.headers.host;
            console.log(req.headers);
            var isAgent = agentHosts.indexOf(hostName) !== -1;
            if(!isAgent){
                debugLog('No proxy1 ---> ' + hostName);
            }else{
                debugLog('Proxy ---> ' + hostName);
            }
            return isAgent;
        },
        requestInterceptor: function (rOptions, req, res, ssl, next){ //拦截客户端请求/响应
            var hostName = req.headers.host;
            var isAgent = agentHosts.indexOf(hostName) !== -1;
            if(isAgent){
                proxy.web(req,res, {
                    target: 'http://localhost:8888'
                }, function (e) {
                    console.log("proxy error call back ");
                    console.log(e);
                });
            }else{
                debugLog('No proxy2 ----> ' + hostName);
                next();
            }

        },
        responseInterceptor: function(req, res, proxyReq, proxyRes, ssl, next)  { //拦截服务端请求/响应
            next();
        },
        getCertSocketTimeout: 3 * 1000
    });
};

try {
    startProxy();
}catch (e) {
    debugLog(e);
}




