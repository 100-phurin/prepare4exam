// 67130500001 - Kanokphon Sueby
import db from '../configs/db-config.js'
import {AppError} from '../middlewares/error-handler.js'
import httpStatus from 'http-status'

const TABLE_NAME = 'brands'
const ENTITY_NAME = 'Brand'

const COUNT_ALL = `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME} ORDER BY id`
const FIND_ONE_SQL = `SELECT * FROM ${TABLE_NAME} WHERE id = ?`

async function count() {
    const [[{total}]] = await db.query(COUNT_ALL)
    return total
}

export async function findAll(pagination) {
    if (!pagination) {
        const [rows] = await db.query(FIND_ALL_SQL)
        return rows
    }
    const {limit, offset} = pagination
    const [rows] = await db.query(FIND_ALL_SQL + ' LIMIT ? OFFSET ?', [limit, offset])
    rows.totalItems = await count()
    return rows
}

export async function findOne(id) {
    const [rows] = await db.query(FIND_ONE_SQL, [id])
    if (rows.length === 0) {
        throw new AppError(`${ENTITY_NAME} with id '${id}' was not found`, httpStatus.NOT_FOUND)
    }
    return rows[0]
}
