const Notification = require('../models/Notification');

/**
 * Create a user notification asynchronously.
 * @param {Object} params
 * @param {string} params.recipient - ObjectId of receiving user
 * @param {string} params.title - Notification title
 * @param {string} params.message - Body text
 * @param {string} [params.type] - Notification type
 * @param {string} [params.link] - Client route
 */
const sendNotification = async ({ recipient, title, message, type = 'SYSTEM', link = '' }) => {
  try {
    if (!recipient) return;
    await Notification.create({
      recipient,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error(`[Notifier Error]: ${err.message}`);
  }
};

module.exports = sendNotification;
