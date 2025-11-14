import { addComment, listComments, lockDocument, unlockDocument, } from './collaboration.service.js';
export const listCommentsHandler = async (req, res) => {
    const comments = await listComments(req.params.documentId);
    res.status(200).json({
        success: true,
        data: comments,
    });
};
export const addCommentHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error('Authenticated user is required');
    }
    const comment = await addComment({
        documentId: req.params.documentId,
        message: req.body.message,
        mentions: req.body.mentions,
        authorId: user.id,
        authorName: `${req.body.authorName ?? ''}`.trim() || user.id,
    });
    res.status(201).json({
        success: true,
        data: comment,
    });
};
export const lockDocumentHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error('Authenticated user is required');
    }
    const document = await lockDocument({ documentId: req.params.documentId, userId: user.id }, req.body.force);
    res.status(200).json({
        success: true,
        data: document,
    });
};
export const unlockDocumentHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error('Authenticated user is required');
    }
    const document = await unlockDocument({ documentId: req.params.documentId, userId: user.id });
    res.status(200).json({
        success: true,
        data: document,
    });
};
