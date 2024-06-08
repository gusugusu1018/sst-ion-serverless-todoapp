/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Table: {
      name: string
      type: "sst.aws.Dynamo"
    }
  }
}
export {}