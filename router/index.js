
var config = require('../config/default');
var http = require('http');
var https = require('https');

function router(req, res, isHttps, next) {
    if (req.method == 'GET'){
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
                    // console.log(data);
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

module.exports = router;