
"use strict";
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();
let response;
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Greetings My world Today',

            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
exports.addName = async (event, context) => {
    let response;

    const id= new Date().getTime()+'x';


   const name  = JSON.parse(event.body); // fetch name property from POST request body
   console.log('------Name='+name );


  console.log('------id='+id );

    const params = {
        TableName: 'Names',
        Item: {
            id,
            name
        }
    };

    try {
        await db.put(params).promise();
        response = {
            statusCode: 201,
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    }

    response = {
            statusCode: 201,
        };

    return response;
}
exports.greetNames = async (event, context) => {
    let response;

console.log('-------entere dgreetNames function');
    try {
        const names = (await db.scan({ TableName: 'Names' }).promise())
            .Items.map((item) => item.name);
console.log('-------names map----' ,JSON.stringify(names));

const data=JSON.stringify(names);

        response = {
            statusCode: 200,
            body: JSON.stringify({
              message: `hello Me changed`+data
            })
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            })
        }
    }

    return response;
}
