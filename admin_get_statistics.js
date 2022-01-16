const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context,callback) => {
            let d = new Date();
            let current_date = d.toISOString().split('T')[0];

            d.setDate(d.getDate() - 6);

            const params = {
                TableName : 'covid_statistics',
                ProjectionExpression: "current_date, positive_cases, recovered",
                FilterExpression: "current_date >= :val",
                ExpressionAttributeValues: {
                 ":val":d.toISOString().split('T')[0],
                }
            }
            let data = await dynamo.scan(params).promise();
            data = data.Items;
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j < ( data.length - i -1 ); j++){

                    if(data[j]["current_date"] < data[j+1]["current_date"]){
                        var temp = data[j]
                        data[j] = data[j + 1]
                        data[j+1] = temp
                    }
                }
            }
            const last_recovered=data[0]["recovered"];
            const last_positive=data[0]["positive_cases"];
            console.log("reco", last_recovered);
            console.log("pos", last_positive);
            data = data.reverse();

            const recovered = [];
            const positive = [];
            const dates = [];
            
            data.forEach( element => {
                dates.push(element["current_date"]);
                recovered.push(element["recovered"]);
                positive.push(element["positive_cases"]);
            });

            
            const params_current_date = {
                TableName : 'covid_statistics',
                ProjectionExpression: "current_date",
                FilterExpression: "current_date = :val",
                ExpressionAttributeValues: {
                 ":val":current_date,
                }
            }
            
            let data_current_date = await dynamo.scan(params_current_date).promise();
            console.log("Data 21 Dec: ",data_current_date.Items);
            
            if(data_current_date.Items[0]==null){
               console.log("in loop");
               dates.push(current_date);
               positive.push(last_positive);
               recovered.push(last_recovered);


                const params_update_current = {
                    TableName : 'covid_statistics',
                    Item:{
                        "current_date": current_date,
                        "recovered":last_recovered,
                        "positive_cases":last_positive
                    }
                }
               
               const updated_statistics = await dynamo.put(params_update_current).promise();
            }
            
        return [dates,recovered,positive]

}
