
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
				console.log(JSON.stringify(data));
				res.end(data);
            })
		});
		// res.end(agentReqUrl);
    });
}


module.exports = router;