const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
    
    const params_update_student_info = {
        TableName : "student-info",
        Key:{
            "student_id": event.student_id,
        },
        UpdateExpression: "set current_device_status = :student_device_status",
        ExpressionAttributeValues:{
            ":student_device_status": event.current_device_status
        },
        ReturnValues:"UPDATED_NEW"

    }
    
    const updated_student_info = await dynamo.update(params_update_student_info).promise();
    
    const params_update_positive = {
        TableName : 'covid_statistics',
        Key:{
            "current_date": event.update_date,
        },
        UpdateExpression: "set positive_cases = positive_cases + :val_increment",
        ExpressionAttributeValues:{
            ":val_increment": 1
        },
        ReturnValues:"UPDATED_NEW"

    }
    
    const updated_positive_data = await dynamo.update(params_update_positive).promise();
    
    const params_scan = {
                TableName : 'covid-tracking',
                FilterExpression: "contains (anonymous_code_list, :searched_code)",
                ExpressionAttributeValues: {
                 ":searched_code":event.covid_code,
                }
            }
    const res = await dynamo.scan(params_scan).promise();
    console.log(res.Items)

    return Promise.all(res.Items.map( item => {
        const lecture_name = item.lecture_name;
        const timestamp = item.timestamp;

        const params_update = {
        TableName : 'covid-tracking',
        Key: {
            lecture_name: lecture_name,
            timestamp: timestamp
        },
        UpdateExpression: 'set covid_status = :covid_status, update_date = :update_date',
        ExpressionAttributeValues:{
            ':covid_status': event.covid_status,
            ':update_date': event.update_date
        },
        ReturnValues:"UPDATED_NEW"
        };
        return dynamo.update(params_update)
            .promise()
            .then(res => {
                console.log(res)
            })
    }))
}

