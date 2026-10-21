// 67130500001 - Kanokphon Sueby
import * as repo from '../repositories/brand-repo.js'

// spec ให้ส่ง brand ตามคอลัมน์ในตาราง จึงไม่ต้องผ่าน mapper
export async function getAllObjects(pagination) {
    return await repo.findAll(pagination)
}

export async function getObject(id) {
    return await repo.findOne(id)
}
