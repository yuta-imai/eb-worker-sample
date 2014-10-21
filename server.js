var http = require('http'),
    winston = require('winston');

var logger = new winston.Logger({
    transports: [ 
        new winston.transports.File({ filename: 'server.log'})
    ]
});

http.createServer(function(req,res){
    logger.info(req.url);
    logger.info(JSON.stringify(req.headers));
    req.on('data',function(data){
        logger.info(data.toString());
    });
    var response = JSON.stringify({result: "success"});
    res.writeHead(200, {"Content-Type":"application/json"});
    res.write(response);
    res.end();
}).listen(process.env.PORT || 3000);
