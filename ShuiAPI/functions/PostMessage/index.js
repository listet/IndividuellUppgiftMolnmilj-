const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index');
const { v4: uuid } = require('uuid');

exports.handler = async (event) => {
    const { text, username } = JSON.parse(event.body);

    //En ny anteckning kräver text samt användarnamn
    if (text && username) {
        try {
            //Får därefter ett ID samt tid för skapande
            const id = uuid().substring(0, 5);
            const createdAt = new Date().toISOString();

            //Lägger in i databasen
            await db.put({
                TableName: 'messages-db',
                Item: {
                    pk: id,
                    username: username,
                    text: text,
                    createdAt: createdAt
                }
            });
            return sendResponse(200, { id, username, text, createdAt });
        } catch (error) {
            return sendError(404, { success: false, message: error.message });
        }
    } else {
        return sendError(404, { success: false, message: 'Could not add message' });
    }
};