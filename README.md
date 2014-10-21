# eb-worker-sample

A sample application for AWS Elastic Beanstalk worker tier, implemented in node.js.
This application fetches image file from remote server and upload it to Amazon S3.

## How it works

aws-sqsd polls Amazon SQS. When message found, 
it makes HTTP POST request to node.js via nginx.

### Architecture

SQS <-(polling)- aws-sqsd -> nginx(port:80) -> node.js(port:8081)

### Message structure

#### header

```json
{
 "host":"localhost",
 "x-real-ip":"127.0.0.1",
 "x-forwarded-for":"127.0.0.1",
 "content-length":"4",
 "content-type":"application/json",
 "user-agent":"aws-sqsd",
 "x-aws-sqsd-msgid":
 "6d4d9535-2325-4099-8711-1aad537e8cce",
 "x-aws-sqsd-receive-count":"7",
 "x-aws-sqsd-first-received-at":
 "2014-10-21T11:01:06Z",
 "x-aws-sqsd-queue":"#<AWS::SQS::Queue:0x007f037cda3348>
}
```

### body

Message itself. If you pass '{"url":"some_url"}', it will come up as string,
so you can use it by parsing as JSON to map.

## How to use

You need [AWS Elastic Beanstalk Command Line Tool](https://github.com/imaifactory/eb-worker-sample.git).

```
git clone https://github.com/imaifactory/eb-worker-sample.git
cd eb-worker-sample
eb init # Configuration wizard will come up. You should choose node.js environment.
eb start # Start eb environment.
```

Then you have to configure environment variables to specify your Amazon S3 bucket.
![screen shot](https://raw.github.com/imaifactory/eb-worker-sample/master/assets/screenshot01.png)

Also you need to configure instance profile or AWS credentials as environment variables.

Now you can deploy the app.

```
git aws.push # Deploy code to eb environment.
```

Then you can pass a message to Amazon SQS.
Please note that SQS Queue will be automatically created by AWS Elatic Beanstalk.
The message format is here.

```json
{"url":"http://example.com/PATH/TO/IMAGE/sample.jpg"}
```

![screen shot](https://raw.github.com/imaifactory/eb-worker-sample/master/assets/screenshot02.png)

Finally, you can find the image file on Amazon S3.

![screen shot](https://raw.github.com/imaifactory/eb-worker-sample/master/assets/screenshot03.png)
