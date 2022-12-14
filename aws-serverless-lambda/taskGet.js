'usestrict';
const AWS = require('aws-sdk');


exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0

    const params={
        TableName:"Tasks",
        FilterExpression:"contains(SK,:sk)",
        ExpressionAttributeValues:{
            ":sk": "task"
        }
    }
    try{
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items)
        statusCode=200

    }catch(err){
        responseBody = "Unable to get task: "+err
        statusCode=403;

    }

    let response={
        statusCode:statusCode,
        headers:{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":"*"
        },
        body:responseBody

    }

    return response
}