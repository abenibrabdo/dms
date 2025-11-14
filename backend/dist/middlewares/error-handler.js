import { AppError } from '@core/errors.js';
import { logger } from '@core/logger.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        if (!err.isOperational) {
            logger.error({ err }, 'Unhandled operational error');
        }
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
    }
    logger.error({ err }, 'Unexpected error');
    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
    });
};
