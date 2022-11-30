'usestrict';
const AWS = require('aws-sdk');


exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0

    const {id} = event.pathParameters

    const params={
        TableName:"Tasks",
        Key:{
            PK:id,
            SK:"task"
        }
    }
    try{
        const data = await documentClient.delete(params).promise();
        responseBody = JSON.stringify(data)
        statusCode=201

    }catch(err){
        responseBody = "Unable to delete task: "+err
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