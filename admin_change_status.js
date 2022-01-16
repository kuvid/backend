const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

function generateRandomStatusCode() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!_-?*.';
    for ( var i = 0; i < 20; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 20));
   }
   return result;
}


exports.handler = async (event, context,callback) => {

    if(event.covid_status.toLowerCase()=="positive"){
        const params_update_positive = {
                TableName : 'covid_statistics',
                Key:{
                    "current_date": event.update_date,
                },
                UpdateExpression: "set positive_cases = positive_cases + :val_increment",
                ExpressionAttributeValues:{
                    ":val_increment": 1
                },
        }
        
    
        const updated_positive_data = await dynamo.put(params_update_positive).promise();
    } else {
        const params_update_recovered = {
                TableName : 'covid_statistics',
                Key:{
                    "current_date": event.update_date,
                },
                UpdateExpression: "set recovered = recovered + :val_increment, positive_cases = positive_cases + :val_decrement",
                ExpressionAttributeValues:{
                    ":val_increment": 1,
                    ":val_decrement": -1
                },
        }
    
        const updated_positive_recovered = await dynamo.update(params_update_recovered).promise();
        
        const params_update_student_info = {
                TableName : 'student-info',
                Key:{
                    "student_id": event.student_id,
                },
                UpdateExpression: "set current_device_status = :new_code",
                ExpressionAttributeValues:{
                    ":new_code": generateRandomStatusCode(),
                },
        }
    
        const updated_student_info = await dynamo.update(params_update_student_info).promise();
        console.log(updated_student_info)
    }
    
     
}
