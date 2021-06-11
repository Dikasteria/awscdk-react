import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as HelloCdk from '../lib/hello-cdk-stack';
import '@aws-cdk/assert/jest';

test('should create a new stack', () => {
  const prep = new cdk.Stack();
  const stack = new HelloCdk.HelloCdkStack(prep, "testStack");
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('should create correct constructs', () => {
  const prep = new cdk.Stack()
  const stack = new HelloCdk.HelloCdkStack(prep, "testStack");
  expect(stack).toHaveResource("AWS::AppSync::GraphQLApi");
  expect(stack).toHaveResource("AWS::DynamoDB::Table");
  expect(stack).toHaveResource("AWS::Cognito::UserPool");
});
