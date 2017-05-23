
var config = require('../config/default');
var http = require('http');
var https = require('https');

function router (app){
	app.get('/', function (req, res) {
    	res.end('LXBackendAgent start success!');
  	});
	app.get('/*', function (req, res) {
		var originalUrl = req.originalUrl;
		var agentReqUrl = config.schema + config.agentHost + originalUrl;
		http.get(agentReqUrl,function (res2) {
			var data = '';
			res2.on('data', function (trunk) {
				data += trunk;
            });
			res2.on('end', function () {
                console.log('\n');
                console.log(originalUrl);
                console.log(agentReqUrl);
				console.log(data);
				res.writeHead(200, 'success',{
                    'content-type': 'text/plain;charset=UTF-8'
                });
				res.write(data, 'utf8');
				res.end();
            })
		});
    });
}
var targetHost = config.schema + config.host + ':' + config.port;

var proxyEnable = function (req, res) {
    var proxy = global.proxy;
    var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("client ip:" + ip + ", host:" + host);

    switch(host) {

        case 'vmcc.oa.com':
            proxy.web(req, res, {target: 'http://vmcc.oa.com'});
            break;
        case 'vmcdn.oa.com':
            proxy.web(req, res, {target: 'http://vmcdn.oa.com'});
            break;
        case 'apidev.lexue.com':
            proxy.web(req, res, {target: targetHost});
            break;
        default:
            break;
    }
}

module.exports = router;