
var express = require('express');
var config = require('./config/default.js');
var pkg = require('./package');
var path = require('path');
var router = require('./router');

var app = express();

//设置路由
router(app);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 监听端口，启动程序
app.listen(config.port, function (err) {

	console.log(`${pkg.name} start success! listening on port ${config.port}`);
});

