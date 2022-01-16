const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
            let d = new Date();
            d.setDate(d.getDate() - 6);
            
            const params = {
                TableName : 'covid_statistics',
                ProjectionExpression: "current_date, positive_cases, recovered",
                FilterExpression: "current_date >= :val",
                ExpressionAttributeValues: {
                 ":val":"2021",
                }
            }
            let data = await dynamo.scan(params).promise();
            let recovered_sum = 0;
            let positive_sum = 0;
            let total_ratio = 0;
            
            data.Items.forEach( element => {
                recovered_sum += element["recovered"];
                positive_sum += element["positive_cases"];
            });
            total_ratio = positive_sum/1000;
            
        return [recovered_sum,positive_sum,total_ratio]

}
