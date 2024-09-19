const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/index.js')

exports.handler = async (event) => {
  try {
    const { Items } = await db.scan({
      TableName: 'messages-db',
    });

    if (Items) {
      return sendResponse(200, Items);
    } else {
      sendError(404, { success: false, message: 'No messages found' });
    }

  } catch (error) {
    return sendError(404, { success: false, message: error.message });
  }
};