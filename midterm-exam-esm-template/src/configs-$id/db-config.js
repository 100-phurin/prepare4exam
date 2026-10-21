//{student-id} - {student-name}
import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql@sit',
    database: 'database-name',
})
export default db