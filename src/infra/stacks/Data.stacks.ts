import { Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getSuffixFromStack } from '../Utils'

export class DataStack extends Stack {

  public readonly spacesTable: ITable

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)

    const spacesTable = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `SpaceTable-${suffix}`,
    })

    // spacesTable.addGlobalSecondaryIndex({
    //   indexName: 'GS1',
    //   partitionKey: {
    //     name: 'name',
    //     type: AttributeType.STRING,
    //   },
    // })

    this.spacesTable = spacesTable
  }
}