import { Op } from 'sequelize';

import { DocumentModel, DocumentVersionModel } from '@modules/documents/document.model.js';
import { toManagedDocument } from '@modules/documents/document.service.js';
import { CommentModel } from '@modules/collaboration/comment.model.js';
import { NotificationModel } from '@modules/notifications/notification.model.js';
import { WorkflowModel, WorkflowStepModel } from '@modules/workflows/workflow.model.js';
import { toWorkflowInstance } from '@modules/workflows/workflow.service.js';

import type { SyncRequestOptions, SyncSnapshot, SyncTopic } from './sync.types.js';

const DEFAULT_LIMIT = 100;

const shouldInclude = (topics: SyncTopic[] | undefined, topic: SyncTopic) => {
  if (!topics || topics.length === 0) return true;
  return topics.includes(topic);
};

export const getSyncSnapshot = async (options: SyncRequestOptions): Promise<SyncSnapshot> => {
  const since = options.since ?? new Date(0);
  const limit = options.limit ?? DEFAULT_LIMIT;
  const topics = options.topics;

  const snapshot: SyncSnapshot = {
    cursor: new Date().toISOString(),
  };

  if (shouldInclude(topics, 'documents')) {
    const documents = await DocumentModel.findAll({
      where: {
        updatedAt: { [Op.gt]: since },
      },
      include: [
        {
          model: DocumentVersionModel,
          as: 'versions',
        },
      ],
      order: [['updatedAt', 'ASC']],
      limit,
    });
    snapshot.documents = documents.map(toManagedDocument);
  }

  if (shouldInclude(topics, 'workflows')) {
    const workflows = await WorkflowModel.findAll({
      where: {
        updatedAt: { [Op.gt]: since },
      },
      include: [
        {
          model: WorkflowStepModel,
          as: 'steps',
        },
      ],
      order: [['updatedAt', 'ASC']],
      limit,
    });
    snapshot.workflows = workflows.map(toWorkflowInstance);
  }

  if (shouldInclude(topics, 'notifications') && options.userId) {
    const notifications = await NotificationModel.findAll({
      where: {
        recipient: options.userId,
        updatedAt: { [Op.gt]: since },
      },
      order: [['updatedAt', 'ASC']],
      limit,
    });
    snapshot.notifications = notifications.map((item) => item.get({ plain: true }));
  }

  if (shouldInclude(topics, 'comments')) {
    const comments = await CommentModel.findAll({
      where: {
        updatedAt: { [Op.gt]: since },
      },
      order: [['updatedAt', 'ASC']],
      limit,
    });
    snapshot.comments = comments.map((item) => item.get({ plain: true }));
  }

  return snapshot;
};


