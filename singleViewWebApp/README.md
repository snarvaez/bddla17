# Serverless Web App with MongoDB Atlas
## Demo for Big Data Day LA 2017
## based on [aws-serverless-express](https://github.com/awslabs/aws-serverless-express)

Instructions:
* Create a MongoDB Atlas Account & Group
* Setup security including a user with read/write access to your database
* Setup [VPC Peering](https://docs.atlas.mongodb.com/security-vpc-peering/) between your Atlas group and your AWS region.
* Create an M10 (or larger) cluster against an AWS region
* Change MongoDB Atlas connection string in [config/db.js](config/db.js)
* Follow instructions from [aws-serverless-express example](https://github.com/awslabs/aws-serverless-express/tree/master/example#creating-or-migrating-a-nodejs-project-based-on-the-example) to add your AWS account, region, bucket & lambda function name, and deploy!
