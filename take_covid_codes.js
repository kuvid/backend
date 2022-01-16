const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context,callback) => {
    
    const params = {
      TableName : 'covid-tracking',
      Key: {
        lecture_name: event.lecture_name,
        lecture_time: event.lecture_time,
        covid_status: "Negative",
        case_count: 0,
        update_date: event.lecture_time,
        anonymous_code_list: event.code_list
      }
    }
    dynamo.put(event.payload, callback);
    console.log("Payload: ",event.payload);
}
