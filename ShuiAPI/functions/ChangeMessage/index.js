const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    const { text, username } = JSON.parse(event.body);

    try {
        const { Item } = await db.get({
            TableName: 'messages-db',
            Key: {
                pk: id,
            }
        });

        if (!Item) {
            return sendError(404, { success: false, message: 'Message not found' });
        }

        await db.update({
            TableName: 'messages-db',
            Key: { pk: id },
            UpdateExpression: 'SET #t = :text, #u = :username',
            ExpressionAttributeNames: {
                '#t': 'text',
                '#u': 'username'
            },
            ExpressionAttributeValues: {
                ':text': text,
                ':username': username
            },
            ReturnValues: 'ALL_NEW'
        });
        return sendResponse(200, { success: true, message: 'Message successfully changed' });
    } catch (error) {
        return sendError(404, { success: false, message: error.message })
    }
};