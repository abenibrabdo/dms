import { getActivityTrend, getDashboardSummary, getStorageMetrics, getUserActivityLeaderboard, } from './analytics.service.js';
const toCsv = (rows, headers) => {
    const headerRow = headers.join(',');
    const dataRows = rows.map((row) => headers
        .map((key) => {
        const value = row[key];
        if (value === null || value === undefined) {
            return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    })
        .join(','));
    return [headerRow, ...dataRows].join('\n');
};
const maybeSendCsv = (res, rows, headers, fileName, format) => {
    if (format === 'csv') {
        const csv = toCsv(rows, headers);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.status(200).send(csv);
        return true;
    }
    return false;
};
export const getAnalyticsSummaryHandler = async (_req, res) => {
    const summary = await getDashboardSummary();
    res.status(200).json({
        success: true,
        data: summary,
    });
};
export const getStorageMetricsHandler = async (req, res) => {
    const metrics = await getStorageMetrics();
    const format = req.query.format?.toString();
    const breakdown = req.query.breakdown?.toString() ?? 'department';
    if (format === 'csv' &&
        maybeSendCsv(res, breakdown === 'mimeType' ? metrics.byMimeType : metrics.byDepartment, breakdown === 'mimeType'
            ? ['mimeType', 'versions', 'storageBytes']
            : ['department', 'documents', 'versions', 'storageBytes'], `storage-${breakdown}.csv`, format)) {
        return;
    }
    res.status(200).json({
        success: true,
        data: metrics,
    });
};
export const getActivityTrendHandler = async (req, res) => {
    const days = req.query.days ? Number.parseInt(req.query.days.toString(), 10) : 14;
    const format = req.query.format?.toString();
    const trend = await getActivityTrend(days);
    if (format === 'csv') {
        const mergedMap = new Map();
        trend.documents.forEach((entry) => {
            const date = entry.date;
            const current = mergedMap.get(date) ?? {
                date,
                documents: 0,
                workflows: 0,
                notifications: 0,
            };
            current.documents = Number(entry.documents ?? 0);
            mergedMap.set(date, current);
        });
        trend.workflows.forEach((entry) => {
            const date = entry.date;
            const current = mergedMap.get(date) ?? {
                date,
                documents: 0,
                workflows: 0,
                notifications: 0,
            };
            current.workflows = Number(entry.workflows ?? 0);
            mergedMap.set(date, current);
        });
        trend.notifications.forEach((entry) => {
            const date = entry.date;
            const current = mergedMap.get(date) ?? {
                date,
                documents: 0,
                workflows: 0,
                notifications: 0,
            };
            current.notifications = Number(entry.notifications ?? 0);
            mergedMap.set(date, current);
        });
        const rows = Array.from(mergedMap.values()).sort((a, b) => a.date.localeCompare(b.date));
        if (maybeSendCsv(res, rows, ['date', 'documents', 'workflows', 'notifications'], 'activity-trend.csv', format)) {
            return;
        }
    }
    res.status(200).json({
        success: true,
        data: trend,
    });
};
export const getUserActivityLeaderboardHandler = async (req, res) => {
    const limit = req.query.limit ? Number.parseInt(req.query.limit.toString(), 10) : 10;
    const format = req.query.format?.toString();
    const leaderboard = await getUserActivityLeaderboard(limit);
    if (maybeSendCsv(res, leaderboard, ['userId', 'documentVersions', 'comments', 'storageBytes'], 'user-activity.csv', format)) {
        return;
    }
    res.status(200).json({
        success: true,
        data: leaderboard,
    });
};
