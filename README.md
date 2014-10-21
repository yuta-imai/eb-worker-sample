# eb-worker-sample

A sample application for AWS Elastic Beanstalk worker tier, implemented in node.js.
This application fetches image file from remote server and upload it to Amazon S3.

## How it works

Will write this later.

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
