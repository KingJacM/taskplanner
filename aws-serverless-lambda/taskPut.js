'usestrict';
const AWS = require('aws-sdk');


exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0
    let {id,taskname} = JSON.parse(event.body)

    const params={
        TableName:"Tasks",
        Item:{
            id:id,
            taskName: taskname
        }
    }
    try{
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data)
        statusCode=201

    }catch(err){
        responseBody = "Unable to put task: "+err
        statusCode=403;

    }

    let response={
        statusCode:statusCode,
        headers:{
        "Content-Type": "application/json"
        },
        body:responseBody

    }

    return response
}