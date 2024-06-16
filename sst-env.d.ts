/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Api: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    GoogleClientId: {
      type: "sst.sst.Secret"
      value: string
    }
    GoogleClientSecret: {
      type: "sst.sst.Secret"
      value: string
    }
    StaticSite: {
      type: "sst.aws.StaticSite"
      url: string
    }
    Table: {
      name: string
      type: "sst.aws.Dynamo"
    }
    UserPool: {
      id: string
      type: "sst.aws.CognitoUserPool"
    }
    WebClient: {
      id: string
      secret: string
      type: "sst.aws.CognitoUserPoolClient"
    }
  }
}
export {}