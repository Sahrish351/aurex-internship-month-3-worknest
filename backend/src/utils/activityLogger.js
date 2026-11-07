const ActivityLog = require('../models/ActivityLog');

/**
 * Log an application activity asynchronously without crashing the main thread.
 * @param {Object} params
 * @param {string} params.actor - ObjectId of user initiating action
 * @param {string} params.action - Verb or constant describing action (e.g., 'PROJECT_CREATED')
 * @param {string} params.entityType - 'Project' | 'Task' | 'Comment' | 'User'
 * @param {string} [params.entityId] - ObjectId of affected resource
 * @param {string} params.details - Human readable description
 */
const logActivity = async ({ actor, action, entityType, entityId, details }) => {
  try {
    if (!actor) return;
    await ActivityLog.create({
      actor,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (err) {
    console.error(`[ActivityLogger Error]: ${err.message}`);
  }
};

module.exports = logActivity;
