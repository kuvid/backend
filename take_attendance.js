const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context,callback) => {
    
    const params = {
      TableName : 'attendance',
      Key: {
        lecture_name: event.lecture_name,
        lecture_time: event.lecture_time,
        instructor_id: event.instructor_id,
        instructor_name: event.instructor_name,
        instructor_email: event.instructor_name,
        students: event.students
      }
    }
    dynamo.put(event.payload, callback);
    console.log("Payload: ",event.payload);
}
