const http = require('http');
const request = require('request');
const httpProxy = require('http-proxy');
const debugLog = require('debug')('BA:index');


var proxy = httpProxy.createProxyServer();

var reqNum  = 0; // 缓存目前请求的数量

proxy.on('proxyReq',function () {
    reqNum ++;
});


proxy.on('proxyRes',function (req, res) {
    debugLog('[proxyRes] headers: %s  body: %s', res.headers, res.body);
    reqNum --;
});

proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
    debugLog('[proxy error] %s', err);
});

proxy.on('close', function (res, socket, head) {
    // view disconnected websocket connections
    debugLog('[Client disconnected]');
});

var config = require('./config/default.js');
// 监听端口，启动程序
var agentHosts = config.agentHosts;

// Create an HTTP tunneling proxy
const agentServer = http.createServer((req, res) => {
    var hostName = req.headers.host;
    var isAgent = agentHosts.indexOf(hostName) !== -1;
    if(isAgent){
        debugLog('agent host: ' + hostName);
        proxy.web(req,res, {
            target: 'http://localhost:8888'
        }, function (e) {
            debugLog("proxy error call back ");
            debugLog(e);
        });
    }else{
        debugLog('No proxy2 ----> ' + hostName + '  ' + req.url);
        debugLog(req.body);
        var proxyReq = request(req.url);
        req.pipe(proxyReq);
        proxyReq.pipe(res);
    }
});


// now that proxy is running
agentServer.listen(8067, '127.0.0.1', () => {

    // make a request to a tunneling proxy
    debugLog('proxy start success! port: 8067');
});