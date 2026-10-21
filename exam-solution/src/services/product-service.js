// 67130500001 - Kanokphon Sueby
import * as repo from '../repositories/product-repo.js'
import mapper from '../mappers/product-mapper.js'
import {AppError} from '../middlewares/error-handler.js'
import httpStatus from 'http-status'

// คอลัมน์ที่ยอมให้ client ส่งมา (กันคนส่ง id / created_at มาเขียนทับ)
const FIELDS = ['sku', 'name', 'brand_id', 'category', 'price', 'ram_gb', 'storage_gb',
    'color', 'stock_quantity', 'status', 'release_date']
const REQUIRED = ['sku', 'name', 'brand_id', 'category', 'price']

// รับได้ทั้ง snake_case (brand_id) และ camelCase (brandId)
const camel = s => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

function pickFields(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new AppError('Request body must be a JSON object', httpStatus.BAD_REQUEST)
    }
    const data = {}
    for (const f of FIELDS) {
        if (body[f] !== undefined) data[f] = body[f]
        else if (body[camel(f)] !== undefined) data[f] = body[camel(f)]
    }
    return data
}

export async function getAllObjects(pagination, viewType = 'summary') {
    const objects = await repo.findAll(pagination)
    return mapper.maps(objects, viewType)
}

export async function getObject(id, viewType = 'full') {
    return mapper.map(await repo.findOne(id), viewType)
}

export async function createObject(body) {
    const data = pickFields(body)
    const missing = REQUIRED.filter(f => data[f] === undefined || data[f] === null || data[f] === '')
    if (missing.length > 0) {
        throw new AppError(`Missing required field(s): ${missing.join(', ')}`, httpStatus.BAD_REQUEST)
    }
    return mapper.map(await repo.create(data))
}

export async function updateObject(id, body) {
    const data = pickFields(body)
    if (Object.keys(data).length === 0) {
        throw new AppError('No updatable fields in request body', httpStatus.BAD_REQUEST)
    }
    return mapper.map(await repo.update(id, data))
}

export async function removeObject(id) {
    return await repo.remove(id)
}
