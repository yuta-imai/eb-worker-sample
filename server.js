var aws = require('aws-sdk'),
    http = require('http'),
    winston = require('winston'),
    url = require('url'),
    mime = require('mime');

var awsRegion = 'ap-northeast-1',
    bucketName = process.env.BUCKET,
    re_mime_matcher = /image/gi,
    re_filename_extractor = /(\w+\.(png|jpg|gif))$/gi,
    logfile = 'server.log';

var logger = new winston.Logger({
    transports: [ 
        new winston.transports.File({ filename: logfile})
    ]
});

http.createServer(function(req,res){

    logger.info(JSON.stringify(req.headers));
    req.on('data',function(data){

        try{
            var hash = JSON.parse(data.toString());
        }catch(e){
            returnResponse(res,400);
        }

        if(!hash.url || !validateUrl(hash.url)){
            returnResponse(res,400);
        }

        fetchImage(hash.url,function(error,fetchResult){

            if(error) returnResponse(res,400);

            uploadImageToS3(
                bucketName,
                fetchResult.filename,
                fetchResult.body,
                function(error,uploadResult){
                    if(error) returnResponse(res,400);
                    returnResponse(res,200) ;                   
                })
            });
        });

        res.writeHead(200);
        res.end();
    });

}).listen(process.env.PORT || 3000);

function returnResponse(httpResponse, status){
    httpResponse.writeHead(status);
    httpResponse.end();
}

function validateUrl(string){
    var result = url.parse(string);
    if(result.hostname){
        return true;
    }else{
        return false;
    }
}

function fetchImage(url,callback){
    http.get(url,function(res){

        if(!res.headers['content-type'].match(re_mime_matcher)){
            callback('mime_error',null);
        }

        var imageData = '';
        res.setEncoding('binary');
        res.on('data',function(chunk){
            imageData += chunk;
        });

        res.on('end',function(){
            var filename = extractFileName(url);
            var buf = new Buffer(imageData,'binary');
            callback(null,{filename:filename,body:buf})
        });
    });
}

function uploadImageToS3(bucketname,filename,body,callback){
    var s3 = new aws.S3({region:awsRegion});
    var params = {
        ACL: 'public-read',
        Body: body,
        Bucket: bucketName,
        ContentLength: body.length,
        ContentType: mime.lookup(filename),
        Key: filename
    };
    s3.putObject(params,function(error,res){
        if(error) callback(error,null);
        else callback(null,'done');
    });
}

function extractFileName(string){
    var filename = string.match(re_filename_extractor);
    return filename[0];
}
