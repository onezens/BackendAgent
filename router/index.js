
var config = require('../config/default');
var http = require('http');
var https = require('https');
var formidable = require('formidable');
var querystring=require("querystring");
var zlib = require('zlib');

var url = require('url');

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

        switch (routerStr){
            case '2/profile':
                getProfile(res, agentReqUrl);
                break;
            default:
                getData(req, res, next);
                break;
        }

    }else if (req.method == 'POST'){
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            postData(req, res, fields, next);
        });
    }else{
        console.log('Unsupported request method : ' + req.method);
        next();
    }
}



function getData(reqOri, resOri, next) {

    var headers = reqOri.headers;
    var urlObj = url.parse(reqOri.url);
    var defaultPort = reqOri.url.indexOf('http')!=-1 ? 80: 443;
    var port = urlObj.port ? urlObj.port : defaultPort;

    var options={
        hostname:urlObj.host,
        port:port,
        path: urlObj.path,
        headers:headers,
        query: reqOri.query
    }

    var req=http.request(options,function(res){

        if(res.headers['content-encoding'] && res.headers['content-encoding'].indexOf('gzip') != -1){
            var resDataGzip = [];
            res.on("data",function(chunk){
                resDataGzip.push(chunk);
            });
            res.on("end",function(){
                var buffer = Buffer.concat(resDataGzip);
                zlib.gunzip(buffer, function(err, decoded) {
                    resEnd(resOri, decoded.toString(), res.headers);
                })
            });

        }else{
            var resData = '';
            res.on("data",function(chunk){
                resData += chunk;
            });
            res.on("end",function(){

                resEnd(resOri, resData, res.headers);

            });
        }

    });

    req.on("error",function(err){
        console.log(err.message);
        next();
    })
    req.write('');
    req.end();
}


function postData(reqOri, resOri, fields, next) {
    var headers = reqOri.headers;
    var host = headers.host;
    var urlObj = url.parse(reqOri.url);
    var path = urlObj.path;
    var defaultPort = reqOri.url.indexOf('http')!=-1 ? 80: 443;
    var port = urlObj.port ? urlObj.port : defaultPort;
    var postData=querystring.stringify(fields);
    var options={
        hostname:host,
        port:port,
        path:path,
        method:"POST",
        headers:headers
    }

    var req=http.request(options,function(res){

        if(res.headers['content-encoding'] && res.headers['content-encoding'].indexOf('gzip') != -1){
            var resDataGzip = [];
            res.on("data",function(chunk){
                resDataGzip.push(chunk);
            });
            res.on("end",function(){
                var buffer = Buffer.concat(resDataGzip);
                zlib.gunzip(buffer, function(err, decoded) {
                    resEnd(resOri, decoded.toString(), res.headers);
                })
            });

        }else{
            var resData = '';
            res.on("data",function(chunk){
                resData += chunk;
            });
            res.on("end",function(){

                resEnd(resOri, resData, res.headers);

            });
        }

    });

    req.on("error",function(err){
        console.log(err.message);
        next();
    })
    req.write(postData);
    req.end();

}

function resEnd(res ,endData, headers) {
    console.log(endData);
    res.writeHead(200, 'success',headers);
    res.write(endData, 'utf8');
    res.end();
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

function fetchData(res, req, netSpider,agentReqUrl) {
    try{
        netSpider.get(agentReqUrl,function (res2) {
            var data = '';
            res2.on('data', function (trunk) {
                data += trunk;
            });
            res2.on('end', function () {
                logData(agentReqUrl, data);
                res.writeHead(200, 'success',req.headers);
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

module.exports = router;