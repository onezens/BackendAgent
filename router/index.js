
var config = require('../config/default');
var http = require('http');
var https = require('https');

function requstTest() {
    https.get('https://apidev.lexue.com', function (res2) {
        var data = '';
        res2.on('data', function (trunk) {
            data += trunk;
        });
        res2.on('end', function () {
            console.log(data);
        })
    });
}


function router(req, res, isHttps, next) {
    if (req.method == 'get'){
        var netSpider = isHttps ? https : http;
        var agentReqUrl = '';
        if (isHttps){
            agentReqUrl = 'https://' + req.headers.host + req.url;
        }else{
            agentReqUrl = req.url;
        }
        try{
            netSpider.get(agentReqUrl,function (res2) {
                var data = '';
                res2.on('data', function (trunk) {
                    data += trunk;
                });
                res2.on('end', function () {
                    console.log('\n');
                    console.log(agentReqUrl);
                    console.log(data);
                    res.writeHead(200, 'success',{
                        'content-type': 'text/plain;charset=UTF-8'
                    });
                    res.write(data, 'utf8');
                    res.end();
                })
            });
        }catch (err){
            res.statusCode = 500;
            res.end(err.toString());
            console.log('Get Data Error: ' + agentReqUrl);
        }
    }else{
        next();
    }
}


function router1 (app){
	app.get('/', function (req, res) {
    	res.end('LXBackendAgent start success!');
  	});
	app.get('/*', function (req, res) {
	    console.log(1);
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

module.exports = router;