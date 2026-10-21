// 67130500001 - Kanokphon Sueby
import express from 'express'
import brandRouter from './routes/brand-route.js'
import productRouter from './routes/product-route.js'
import {apiResponse} from './mappers/api-response.js'
import {errorHandler, notFound} from './middlewares/error-handler.js'
import {queryParser} from './middlewares/pagination-middleware.js'

// ===== ข้อมูลเฉพาะตัว: วันสอบแก้ 3 บรรทัดนี้ให้ตรงกับ spec ของตัวเอง =====
const STUDENT_ID = '67130500001'
const STUDENT_NAME = 'Kanokphon Sueby'
const SECRET_KEY = '67KaSu'
// ===================================================================

const PORT = 3000
const BASE = `/api/${STUDENT_ID}`

const app = express()
app.use(express.json())       // 1) parse JSON body → req.body
app.use(queryParser())        // 2) page/limit → req.pagination (ต้องอยู่ก่อน router)

// 2.1 Identity Verification
app.get(`${BASE}/student-info`, (req, res) => {
    apiResponse(res, {studentId: STUDENT_ID, name: STUDENT_NAME, secretKey: SECRET_KEY})
})

// 2.2 / 2.3 Resources
app.use(`${BASE}/brands`, brandRouter)
app.use(`${BASE}/products`, productRouter)

app.use(notFound)             // 3) ไม่มี route ตรง → 404
app.use(errorHandler)         // 4) error handler ต้องอยู่ท้ายสุด

app.listen(PORT, () => {
    console.log(`${STUDENT_ID} - ${STUDENT_NAME}`)
    console.log(`API running at http://localhost:${PORT}${BASE}`)
})
