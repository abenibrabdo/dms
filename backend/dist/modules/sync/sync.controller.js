import { getSyncSnapshot } from './sync.service.js';
export const getSyncSnapshotHandler = async (req, res) => {
    const sinceParam = req.query.since?.toString();
    const limit = req.query.limit ? Number.parseInt(req.query.limit.toString(), 10) : undefined;
    const topicsQuery = req.query.topics?.toString();
    const topics = topicsQuery?.split(',').map((topic) => topic.trim());
    const since = sinceParam ? new Date(sinceParam) : undefined;
    const snapshot = await getSyncSnapshot({
        since,
        limit,
        topics,
        userId: req.user?.id,
    });
    res.status(200).json({
        success: true,
        data: snapshot,
    });
};
