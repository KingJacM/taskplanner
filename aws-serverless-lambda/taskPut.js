'usestrict';
const AWS = require('aws-sdk');
const crypto = require('node:crypto');

exports.handler = async (event, context) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = ""
    let statusCode = 0
    let {taskName, taskDetail,startDate,endDate,totalHours,timeSection,quantity,quantifier} = JSON.parse(event.body)

    const params={
        TableName:"Tasks",
        Item:{
            PK:crypto.randomUUID(),
            SK:"task",
            taskName: taskName,
            taskDetail:taskDetail,
            startDate: startDate,
            endDate: endDate,
            currentProgress: 0,
            totalHours: totalHours,
            timeSection: timeSection,
            lastFinishDate:"",
            quantity:quantity,
            quantifier:quantifier
            
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