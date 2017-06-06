
var config = require('../config/default');
var http = require('http');
var https = require('https');
var profileData = require('../json/profile.json');

function router(req, res, isHttps, next) {
    if (req.method == 'GET'){
        var netSpider = isHttps ? https : http;
        var host = req.headers.host;
        var agentReqUrl = '';
        if (isHttps){
            agentReqUrl = 'https://' + host + req.url;
        }else{
            agentReqUrl = req.url;
        }
        var indexOfPara = agentReqUrl.indexOf('?');
        var routerStr = agentReqUrl.substring(agentReqUrl.indexOf(host) + host.length + 1, indexOfPara);
        if (routerStr.length > 0){
            switch (routerStr){
                case '2/profile':
                    getProfile(res, agentReqUrl);
                    break;
                default:
                    fetchData(netSpider, agentReqUrl, res);
                    break;
            }

        }else{
            fetchData(netSpider, agentReqUrl, res);
        }

    }else{
        next();
    }
}

function fetchData(netSpider,agentReqUrl,res) {
    try{
        netSpider.get(agentReqUrl,function (res2) {
            var data = '';
            res2.on('data', function (trunk) {
                data += trunk;
            });
            res2.on('end', function () {
                logData(agentReqUrl, data);
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
}


function getProfile(res, url) {
    var data = JSON.stringify(profileData);
    res.writeHead(200, 'success',{
        'content-type': 'text/plain;charset=UTF-8'
    });
    res.write(data, 'utf8');
    res.end();
    logData(url, data);
}

function logData(url, data) {
    console.log('\n' + url.green + '\n' + data.cyan + '\n');
}

module.exports = router;