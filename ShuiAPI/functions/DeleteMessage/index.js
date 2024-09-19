const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');

exports.handler = async (event) => {
    const { id } = event.pathParameters;

    try {
        await db.delete({
            TableName: 'messages-db',
            Key: {
                pk: id
            }
        });

        return sendResponse(200, { success: true });
    } catch (error) {
        return sendError(404, { success: false, message: error.message })
    }
};