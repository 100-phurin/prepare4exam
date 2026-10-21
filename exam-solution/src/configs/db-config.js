// 67130500001 - Kanokphon Sueby
import mysql from 'mysql2/promise'

// แก้ user / password ให้ตรงกับ MySQL ในเครื่องที่สอบ
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '143900',
    database: 'mobile_distributor',
    timezone: 'Z',   // อ่าน/เขียน DATETIME เป็น UTC → created_at ตรง spec (2024-01-01T00:00:00.000Z)
})
export default db
