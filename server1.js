
var util = require('util'),
    http = require('http'),
    httpProxy = require('http-proxy');

//
// Basic Http Proxy Server
//
httpProxy.createServer({
    target:'http://localhost:9004'
}).listen(8004);

//
// Target Http Server
//
// to check apparent problems with concurrent connections
// make a server which only responds when there is a given nubmer on connections
//


var connections = [],
    go;

http.createServer(function (req, res) {
    connections.push(function () {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
    });

    process.stdout.write(connections.length + ', ');

    if (connections.length > 110 || go) {
        go = true;
        while (connections.length) {
            connections.shift()();
        }
    }
}).listen(9004);
