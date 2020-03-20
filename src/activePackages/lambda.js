// eslint-disable-next-line import/no-extraneous-dependencies
const SNS = requre('aws-sdk/clients/sns')
const DynamoDB = require('aws-sdk/clients/dynamodb')

// eslint-disable-next-line no-unused-vars
module.exports.main = async (event) => {
    console.log('Starting activePackages functions');
    const activePackages = await fetchActivePackagesFromDb()
    await Promise.all(activePackages.map(sendToSns))
    console.log('End of activePackages function');
    return true
}

const fetchActivePackagesFromDb = async () => {
    console.log('Running fetchActivePackagesFromDb');

    const dynamodb = new DynamoDB.DocumentClient()
    const params = {
        TableNmae: process.env.dynamoTableName,
        FilterExpression: '#filed = :value',
        ExpressionAttributeNames: {
            '#field': 'delivered',
        },
        ExpressionAttributeValue: {
            ':value': false
        }
    }
    return dynamodb.scan(params).promise().then((result) => {
        console.log(`Fetched ${result.Items.length} items(s) from database`);
        return result.Items
    }).catch((error) => {
        console.error(error)
        throw new Error(error.message)
    })
}

const sendToSns = async (vo) => {
    const sns = new SNS()
    const params = {
        Message: JSON.stringify(vo),
        TopicArn: process.env.snsFanountTopicArn
        };
        console.log(params.Message);

        return sns.publish(params).promise().then(() => {
            console.log(`Sent packageId ${vo.packageId} to SNS`)
        }).catch(err => console.log(err.message))
}