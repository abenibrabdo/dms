import { DocumentModel } from '@modules/documents/document.model.js';
import { NotificationModel } from '@modules/notifications/notification.model.js';
import { WorkflowModel } from '@modules/workflows/workflow.model.js';

export const getDashboardSummary = async () => {
  const [documentStats, workflowStats, notificationStats] = await Promise.all([
    DocumentModel.aggregate([
      {
        $group: {
          _id: '$metadata.status',
          count: { $sum: 1 },
        },
      },
    ]),
    WorkflowModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    NotificationModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const documentSummary = documentStats.reduce<Record<string, number>>((acc, item) => {
    acc[item._id ?? 'unknown'] = item.count;
    return acc;
  }, {});

  const workflowSummary = workflowStats.reduce<Record<string, number>>((acc, item) => {
    acc[item._id ?? 'unknown'] = item.count;
    return acc;
  }, {});

  const notificationSummary = notificationStats.reduce<Record<string, number>>((acc, item) => {
    acc[item._id ?? 'unknown'] = item.count;
    return acc;
  }, {});

  const totalDocuments = Object.values(documentSummary).reduce((sum, value) => sum + value, 0);
  const totalWorkflows = Object.values(workflowSummary).reduce((sum, value) => sum + value, 0);
  const unreadNotifications = notificationSummary.unread ?? 0;

  return {
    totals: {
      documents: totalDocuments,
      workflows: totalWorkflows,
      unreadNotifications,
    },
    breakdowns: {
      documents: documentSummary,
      workflows: workflowSummary,
      notifications: notificationSummary,
    },
  };
};

