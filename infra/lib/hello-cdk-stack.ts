import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //S3 Bucket for React App
    const feBucket = new s3.Bucket(this, "FeBucket", {
      bucketName:"rhey-fe-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      // Allows public access to the bucket so they can see the site
      publicReadAccess: true,
    });
    
    // Deployment bucket
    const feDeployment = new s3Deployment.BucketDeployment(this, "deployFeBucket", {
      sources: [s3Deployment.Source.asset('../frontend/build')],
      destinationBucket: feBucket,
      retainOnDelete: false
    });
    
    // Cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(this, "MyFeDist", {
      originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: feBucket
            },
            behaviors : [ {isDefaultBehavior: true}]
        }
    ]
    });

    distribution.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    //Appsync Api
    const api = new appsync.GraphqlApi(this, 'testApi', {
      //Names the api
      name: "test-graphql-api",
      // Specifies the location of the schema the api will use
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      // defines the default authorization mode
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    api.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
     });
 
    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    //Lambda function which connects the GraphQL operations in the lambda-fns file to the data source
    // This function will interact with the table in DynamoDB
    const notesLambda = new lambda.Function(this, 'AppSyncNotesHandler', {
      // Env the function will run in?
      runtime: lambda.Runtime.NODEJS_12_X,
      // From lambda-fns/main.ts
      handler: 'main.handler',
      // Points to the code for the createNote etc
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024,
      // currentVersionOptions: {
      //   removalPolicy: RemovalPolicy.DESTROY,
      // }
    });
    notesLambda.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    // This sets the function as a data source for the Api
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', notesLambda);


    //Resolvers for the GraphQL operations to interact with the data source.
    // These point to the lambda-fns files where the relevant functions are.
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    // const tableName = 'items';

    // Dynamo DB
    const notesTable = new dynamodb.Table(this, 'cdk-notes-table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Grants permission to the Lambda function to access the DynamoDB table.
    notesTable.grantFullAccess(notesLambda);

    // Creates an environment variable that is used in the function code.
    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName);

    // Cognito user pool -  provides authentication, authorization, and user management
    //
    const userPool = new cognito.UserPool(this, 'newCognitoUserPool', {
      userPoolName: 'test-userpool',
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      signInAliases: {
        username: true,
        email: true
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });



  }
}
