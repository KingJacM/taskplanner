'usestrict';
const AWS = require('aws-sdk');
const crypto = require('node:crypto');

exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0
    let {taskID, milestoneName, milestoneDetail, deadline,expectedProgress} = JSON.parse(event.body)

    const params={
        TableName:"Tasks",
        Item:{
            PK:taskID,
            SK:"milestone_"+milestoneName,
            milestoneName: milestoneName,
            milestoneDetail:milestoneDetail,
            deadline:deadline,
            expectedProgress:expectedProgress
            
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
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":"*"
        },
        body:responseBody

    }

    return response
}