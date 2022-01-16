const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
            
            const params = {
                TableName : 'student-info',
                ProjectionExpression: "current_device_status",
                FilterExpression: "student_id = :student_id",
                ExpressionAttributeValues: {
                 ":student_id": event.student_id
                }
            }
            let data = await dynamo.scan(params).promise();

        console.log(data)

    return data.Items[0]["current_device_status"];
       

}



