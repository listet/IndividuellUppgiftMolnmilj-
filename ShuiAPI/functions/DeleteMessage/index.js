const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');

exports.handler = async (event) => {
    const { id } = event.pathParameters;

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

        await db.delete({
            TableName: 'messages-db',
            Key: {
                pk: id
            }
        });

        return sendResponse(200, { success: true, message: 'Message successfully deleted' });
    } catch (error) {
        return sendError(404, { success: false, message: error.message })
    }
};