

var httpProxy = require('http-proxy');
// Error example
//
// Http Proxy Server with bad target
//
var proxy = httpProxy.createServer({
    target:'http://localhost:8888'
});

proxy.listen(8067);

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', function (proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

//
// Listen for the `open` event on `proxy`.
//
proxy.on('open', function (proxySocket) {
    // listen for messages coming FROM the target here
    proxySocket.on('data', hybiParseAndLogMessage);
});

//
// Listen for the `close` event on `proxy`.
//
proxy.on('close', function (res, socket, head) {
    // view disconnected websocket connections
    console.log('Client disconnected');
});