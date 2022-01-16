const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
            //I have added event.student parameter to get the student name 
            //from frontend and return her/his lectures as a response.
            //Here, the frontend should send an event including student info 
            //such as {"student_name":"Selin Öztürk","student_id":"60160"}
            console.log("Log basıyoruz: ", event.student);
            
            const params = {
                TableName : 'attendance',
                ProjectionExpression: "lecture_name, instructor_name, lecture_time",
                FilterExpression: "contains (students, :searched_student)",
                ExpressionAttributeValues: {
                 ":searched_student":event.student,
                }
            }
            const data = await dynamo.scan(params).promise();
            console.log(data);

        return { body: JSON.stringify(data.Items) }

}


