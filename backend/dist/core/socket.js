import { Server } from 'socket.io';
import { env } from '@config/index.js';
import { logger } from './logger.js';
let io = null;
export const initializeRealtime = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        logger.info({ socketId: socket.id }, 'Client connected to realtime gateway');
        socket.on('disconnect', (reason) => {
            logger.info({ socketId: socket.id, reason }, 'Client disconnected from realtime gateway');
        });
    });
    logger.info({ port: env.port }, 'Socket.IO realtime gateway initialized');
};
export const getRealtime = () => {
    if (!io) {
        throw new Error('Realtime server not initialized');
    }
    return io;
};
export const broadcastEvent = (channel, payload) => {
    if (!io) {
        logger.warn({ channel }, 'Attempted to broadcast without initialized realtime server');
        return;
    }
    io.emit(channel, payload);
};
