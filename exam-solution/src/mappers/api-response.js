// 67130500001 - Kanokphon Sueby
import httpStatus from 'http-status'

export function apiResponse(res, data, pagination = null, status = httpStatus.OK) {
    return pagination
        ? paginate(res, data, pagination, status)
        : success(res, data, status)
}

// Success Response ทั่วไป
function success(res, data, statusCode) {
    return res.status(statusCode).json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
    })
}

// Success Response แบบแบ่งหน้า
function paginate(res, data, pagination, statusCode) {
    const {limit, page} = pagination
    const total = data.totalItems ?? 0
    return res.status(statusCode).json({
        success: true,
        data: [...data],                       // ตัด property totalItems ออกจาก array
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
        timestamp: new Date().toISOString(),
    })
}
