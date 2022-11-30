'usestrict';
const AWS = require('aws-sdk');


exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0
    const {id} = event.pathParameters

    const params={
        TableName:"Tasks",
        KeyConditionExpression:"PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues:{
            ":pk":id,
            ":sk": "milestone"
        }
    }
    try{
        const data = await documentClient.query(params).promise();
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