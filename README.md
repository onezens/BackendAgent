# BackendAgent
BackendAgent

####用法
通过在配置文件中设置代理域名或者IP，然后在手机WIFI上设置代理服务器的IP和端口(HTTPS服务器同意证书文件)，然后可以截取和修改服务器的数据。

###配置
```
module.exports = {
    port: 8080,  //本地服务器端口
    host: '127.0.0.1', //本地服务器IP
    agentHosts: [   //所有支持的代理服务器
        'api.dev.lexue.com',
        'apidev.lexue.com',
        'api.lexue.com',
        'zkapidev.lexue.com',
        'zkapi.lexue.com'
    ],
    agentPort: 8888 //代理端口
};

```

###使用的模块
* [node-mitmproxy](https://github.com/wuchangming/node-mitmproxy)

```
var agentHosts = config.agentHosts;

var startProxy = function(){
    mitmproxy.createProxy({
        port: config.agentPort,
        sslConnectInterceptor: function(req, cltSocket, head) { //判断该connnect请求是否需要代理
            var hostName = req.headers.host;
            var isAgent = agentHosts.indexOf(hostName) !== -1;
            return isAgent;
        },
        requestInterceptor: function (rOptions, req, res, ssl, next){ //拦截客户端请求/响应
            var hostName = rOptions.hostname;
            router(req, res , ssl, next);
        },
        responseInterceptor: function(req, res, proxyReq, proxyRes, ssl, next)  { //拦截服务端请求/响应
            next();
        }
    });
}

```


