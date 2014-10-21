var http = require('http');

http.createServer(function(req,res){
    console.log(req);
    var response = JSON.stringify({result: "success"});
    res.writeHead(200, {"Content-Type":"application/json"});
    res.write(response);
    res.end();
}).listen(process.env.PORT || 80);
