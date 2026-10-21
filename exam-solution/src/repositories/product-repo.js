// 67130500001 - Kanokphon Sueby
import db from '../configs/db-config.js'
import {AppError} from '../middlewares/error-handler.js'
import httpStatus from 'http-status'

const TABLE_NAME = 'products'
const ENTITY_NAME = 'Product'

const COUNT_ALL = `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME} ORDER BY id`
// JOIN brands เพื่อเอา brandName ไปใส่ใน Detail DTO
const FIND_ONE_SQL = `SELECT p.*, b.name AS brand_name
                      FROM ${TABLE_NAME} p LEFT JOIN brands b ON p.brand_id = b.id
                      WHERE p.id = ?`
const FIND_BY_SKU_SQL = `SELECT id FROM ${TABLE_NAME} WHERE sku = ?`
const CREATE_SQL = `INSERT INTO ${TABLE_NAME} SET ?`
const UPDATE_SQL = `UPDATE ${TABLE_NAME} SET ? WHERE id = ?`
const REMOVE_SQL = `DELETE FROM ${TABLE_NAME} WHERE id = ?`

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

export async function create(data) {
    // เช็ก SKU ซ้ำเองก่อน → 409 (เผื่อตารางจริงไม่ได้ตั้ง UNIQUE ไว้)
    const [existing] = await db.query(FIND_BY_SKU_SQL, [data.sku])
    if (existing.length > 0) {
        throw new AppError(`${ENTITY_NAME} with sku '${data.sku}' already exists`, httpStatus.CONFLICT)
    }
    const [result] = await db.query(CREATE_SQL, [data])
    return findOne(result.insertId)
}

export async function update(id, data) {
    await findOne(id)                                   // ไม่มี → 404
    if (data.sku) {                                     // เปลี่ยน sku ไปชนของคนอื่น → 409
        const [existing] = await db.query(FIND_BY_SKU_SQL, [data.sku])
        if (existing.length > 0 && existing[0].id != id) {
            throw new AppError(`${ENTITY_NAME} with sku '${data.sku}' already exists`, httpStatus.CONFLICT)
        }
    }
    await db.query(UPDATE_SQL, [data, id])
    return findOne(id)
}

export async function remove(id) {
    await findOne(id)                                   // ไม่มี → 404
    const [result] = await db.query(REMOVE_SQL, [id])
    return result.affectedRows > 0
}
