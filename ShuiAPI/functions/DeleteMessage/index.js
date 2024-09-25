const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');

exports.handler = async (event) => {
    //Hittar ID via url
    const { id } = event.pathParameters;

    try {
        //Hämtar ID
        const { Item } = await db.get({
            TableName: 'messages-db',
            Key: {
                pk: id
            }
        });
        if (!Item) {
            return sendError(404, { success: false, message: 'Message not found' });
        }
        //Deletar från databasen via ID
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