const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
        
        const params = {
            TableName : 'covid-tracking',
            ProjectionExpression: "anonymous_code_list",
            FilterExpression: "covid_status = :positive",
            ExpressionAttributeValues: {
                ":positive":"Positive",
            }
        }
        var codes = []
        const data = await dynamo.scan(params).promise();
        
        data.Items.forEach(element => element["anonymous_code_list"].forEach(code => codes.push(code)));        
        var set_codes = new Set(codes);
        console.log(set_codes);

        return  [...set_codes] 
}


