// 67130500001 - Kanokphon Sueby
import httpStatus from 'http-status'

export class AppError extends Error {
    constructor(message, statusCode = httpStatus.INTERNAL_SERVER_ERROR) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = httpStatus[`${statusCode}_NAME`] || httpStatus[statusCode]
        Error.captureStackTrace(this, this.constructor)
    }
}

// ไม่มี route ไหนตรง → 404 แบบ JSON (แทน HTML ของ Express)
export const notFound = (req, res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, httpStatus.NOT_FOUND))
}

// error-handling middleware: ต้องมี 4 parameter และวางท้ายสุดใน app.js
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500
    let errorCode = err.errorCode || httpStatus[`${statusCode}_NAME`] || 'INTERNAL_SERVER_ERROR'
    let message = err.message || 'An unexpected error occurred'

    // แปลง MySQL error code เป็น status ที่เหมาะสม
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409
        errorCode = 'CONFLICT'
        message = 'Resource already exists (unique constraint violation)'
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400
        errorCode = 'FOREIGN_KEY_NOT_FOUND'
        message = 'Referenced record does not exist'
    } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 409
        errorCode = 'RESOURCE_IN_USE'
        message = 'Resource is referenced by other records'
    } else if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'
        || err.code === 'WARN_DATA_TRUNCATED' || err.code === 'ER_BAD_NULL_ERROR') {
        statusCode = 400
        errorCode = 'BAD_REQUEST'
    } else if (err.type === 'entity.parse.failed') {
        statusCode = 400
        errorCode = 'BAD_REQUEST'
        message = 'Invalid JSON body'
    }

    if (statusCode >= 500) console.error(err)

    res.status(statusCode).json({
        success: false,
        error: {code: errorCode, message},
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    })
}
