import { fn, col, Op, QueryTypes } from 'sequelize';
import { sequelize } from '@core/database.js';
import { DocumentModel, DocumentVersionModel } from '@modules/documents/document.model.js';
import { NotificationModel } from '@modules/notifications/notification.model.js';
import { WorkflowModel } from '@modules/workflows/workflow.model.js';
import { CommentModel } from '@modules/collaboration/comment.model.js';
const reduceSummary = (rows, fallback = 'unknown') => {
    return rows.reduce((acc, row) => {
        const key = row.status ?? fallback;
        acc[key] = Number(row.count ?? 0);
        return acc;
    }, {});
};
export const getDashboardSummary = async () => {
    const [documentStats, workflowStats, notificationStats] = await Promise.all([
        DocumentModel.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
            raw: true,
        }),
        WorkflowModel.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
            raw: true,
        }),
        NotificationModel.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
            raw: true,
        }),
    ]);
    const documentSummary = reduceSummary(documentStats);
    const workflowSummary = reduceSummary(workflowStats);
    const notificationSummary = reduceSummary(notificationStats);
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
export const getStorageMetrics = async () => {
    const [totalsRow] = (await sequelize.query(`
      SELECT
        COUNT(DISTINCT d.id) AS documents,
        COUNT(v.id) AS versions,
        SUM(COALESCE(v.size, 0)) AS storageBytes
      FROM documents d
      LEFT JOIN document_versions v ON v.document_id = d.id
    `, { type: QueryTypes.SELECT }));
    const byDepartment = (await sequelize.query(`
      SELECT
        COALESCE(d.department, 'Unassigned') AS department,
        COUNT(DISTINCT d.id) AS documents,
        COUNT(v.id) AS versions,
        SUM(COALESCE(v.size, 0)) AS storageBytes
      FROM documents d
      LEFT JOIN document_versions v ON v.document_id = d.id
      GROUP BY department
      ORDER BY documents DESC
    `, { type: QueryTypes.SELECT }));
    const byMimeType = (await sequelize.query(`
      SELECT
        COALESCE(v.mime_type, 'unknown') AS mimeType,
        COUNT(v.id) AS versions,
        SUM(COALESCE(v.size, 0)) AS storageBytes
      FROM document_versions v
      GROUP BY mimeType
      ORDER BY versions DESC
    `, { type: QueryTypes.SELECT }));
    const documentCount = Number(totalsRow?.documents ?? 0);
    const versionCount = Number(totalsRow?.versions ?? 0);
    const storageBytes = Number(totalsRow?.storageBytes ?? 0);
    return {
        totals: {
            documents: documentCount,
            versions: versionCount,
            storageBytes,
            averageVersionSize: versionCount > 0 ? Math.round(storageBytes / versionCount) : 0,
        },
        byDepartment: byDepartment.map((entry) => ({
            department: String(entry.department),
            documents: Number(entry.documents ?? 0),
            versions: Number(entry.versions ?? 0),
            storageBytes: Number(entry.storageBytes ?? 0),
        })),
        byMimeType: byMimeType.map((entry) => ({
            mimeType: String(entry.mimeType),
            versions: Number(entry.versions ?? 0),
            storageBytes: Number(entry.storageBytes ?? 0),
        })),
    };
};
export const getActivityTrend = async (days = 14) => {
    const rangeEnd = new Date();
    const rangeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const [documentTrend, workflowTrend, notificationTrend] = await Promise.all([
        sequelize.query(`
        SELECT DATE(d.created_at) AS date, COUNT(*) AS documents
        FROM documents d
        WHERE d.created_at >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
        GROUP BY DATE(d.created_at)
        ORDER BY DATE(d.created_at)
      `, { replacements: { days }, type: QueryTypes.SELECT }),
        sequelize.query(`
        SELECT DATE(w.created_at) AS date, COUNT(*) AS workflows
        FROM workflows w
        WHERE w.created_at >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
        GROUP BY DATE(w.created_at)
        ORDER BY DATE(w.created_at)
      `, { replacements: { days }, type: QueryTypes.SELECT }),
        sequelize.query(`
        SELECT DATE(n.created_at) AS date, COUNT(*) AS notifications
        FROM notifications n
        WHERE n.created_at >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
        GROUP BY DATE(n.created_at)
        ORDER BY DATE(n.created_at)
      `, { replacements: { days }, type: QueryTypes.SELECT }),
    ]);
    return {
        range: {
            start: rangeStart.toISOString(),
            end: rangeEnd.toISOString(),
        },
        documents: documentTrend,
        workflows: workflowTrend,
        notifications: notificationTrend,
    };
};
export const getUserActivityLeaderboard = async (limit = 10) => {
    const versionStats = (await DocumentVersionModel.findAll({
        attributes: [
            'createdBy',
            [fn('COUNT', col('id')), 'versionCount'],
            [fn('SUM', fn('COALESCE', col('size'), 0)), 'storageBytes'],
        ],
        where: {
            createdBy: { [Op.ne]: null },
        },
        group: ['createdBy'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit,
        raw: true,
    }));
    const commentStats = (await CommentModel.findAll({
        attributes: ['authorId', [fn('COUNT', col('id')), 'commentCount']],
        where: {
            authorId: { [Op.ne]: null },
        },
        group: ['authorId'],
        limit,
        raw: true,
    }));
    const leaderboard = new Map();
    versionStats.forEach((entry) => {
        const userId = String(entry.createdBy);
        const current = leaderboard.get(userId) ?? {
            userId,
            documentVersions: 0,
            comments: 0,
            storageBytes: 0,
        };
        current.documentVersions += Number(entry.versionCount ?? 0);
        current.storageBytes += Number(entry.storageBytes ?? 0);
        leaderboard.set(userId, current);
    });
    commentStats.forEach((entry) => {
        const userId = String(entry.authorId);
        const current = leaderboard.get(userId) ?? {
            userId,
            documentVersions: 0,
            comments: 0,
            storageBytes: 0,
        };
        current.comments += Number(entry.commentCount ?? 0);
        leaderboard.set(userId, current);
    });
    const ranked = Array.from(leaderboard.values()).sort((a, b) => {
        const contributionsDiff = b.documentVersions + b.comments - (a.documentVersions + a.comments);
        if (contributionsDiff !== 0)
            return contributionsDiff;
        return b.storageBytes - a.storageBytes;
    });
    return ranked.slice(0, limit);
};
