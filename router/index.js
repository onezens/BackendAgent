

function router (app){
	app.get('/', function (req, res) {
    	res.end('LXBackendAgent start success!');
  	});
	app.get('/*', function (req, res) {
		res.end(req.originalUrl);
		// console.log();
    });
}


module.exports = router;