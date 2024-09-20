const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    const { text } = JSON.parse(event.body);

    try {
        const { Item } = await db.get({
            TableName: 'messages-db',
            Key: {
                pk: id
            }
        });

        if (!Item) {
            return sendError(404, { success: false, message: 'Message not found' });
        }
        if (typeof text !== 'string' || text.trim() === '') {
            return sendError(400, { success: false, message: 'No valid new message was provided' });
        }

        await db.update({
            TableName: 'messages-db',
            Key: { pk: id },
            UpdateExpression: 'SET #t = :text',
            ExpressionAttributeNames: { '#t': 'text' },
            ExpressionAttributeValues: { ':text': text }
        });

        return sendResponse(200, { success: true, message: 'Message successfully changed' });
    } catch (error) {
        return sendError(404, { success: false, message: error.message })
    }
};