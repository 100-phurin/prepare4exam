# INT161 สอบปฏิบัติ: ขั้นตอนทำตั้งแต่ต้นจนส่ง

> โค้ดทั้งหมดในไฟล์นี้ผ่าน `tests/test-runner.mjs` **100/100** กับ spec ซ้อม (Mobile Phone Distributor)
> ตัวอย่างใช้รหัส `67130500001` · ชื่อ `Kanokphon Sueby` · Secret `67KaSu` → **วันจริงเปลี่ยนเป็นของตัวเองทุกจุด** (ค้นคำว่า `67130500001` แล้วแทนที่ทั้งหมด)

## สรุปประกาศสอบ

- 6 ข้อ รวม 110 คะแนน (เต็ม 100) → **1C, 3R, 1U, 1D**
- เน้น **CRUD, DTO, Pagination, Exception Handling**
- ใช้เอกสารได้ทั้ง hard copy และ soft copy · โหลดไฟล์ได้เฉพาะ **15 นาทีแรก** · ระหว่างสอบ **ห้ามต่อเน็ต**
- รับ/ส่งงานผ่าน **LEB2** (เช็กว่า login ได้ก่อนวันสอบ)
- ห้ามติดตั้ง dependency เพิ่ม · template วันสอบ **ไม่มี error handling ให้** ต้องเขียนเอง

## แผนเวลา (120 นาที)

| ขั้น | งาน | นาที | ควรเสร็จภายในนาทีที่ |
|---|---|---|---|
| 1 | แตก zip, เปิดโปรเจกต์, `npm install` | 10 | 10 |
| 2 | นำเข้าฐานข้อมูล | 8 | 18 |
| 3 | db-config + script start | 4 | 22 |
| 4 | error-handler | 5 | 27 |
| 5 | pagination middleware | 3 | 30 |
| 6 | app.js + student-info | 7 | 37 |
| 7 | Brands (repo/service/route) | 10 | 47 |
| 8 | Product repository | 12 | 59 |
| 9 | Product mapper (DTO) | 10 | 69 |
| 10 | Product service | 8 | 77 |
| 11 | Product route | 8 | 85 |
| 12 | รัน test ไล่แก้จนครบ | 15 | 100 |
| 13 | zip และส่งผ่าน LEB2 | 10 | 110 |

---

## ช่วง 15 นาทีแรก (ยังมีเน็ต)

### ขั้น 1: แตก zip, เปิดโปรเจกต์, npm install (≈10 นาที)

1. โหลดไฟล์ของ**รหัสตัวเอง**ให้ครบ: zip template, ไฟล์ SQL, spec (.md), โฟลเดอร์ `tests`
2. แตก zip ไปไว้ที่ `Documents\INT161` (อย่าทำใน Downloads) · ระวัง**โฟลเดอร์ซ้อน** และลบ `__MACOSX` ทิ้งได้
3. WebStorm → **Open** → เลือกโฟลเดอร์ที่มี `package.json` อยู่ข้างในตรง ๆ
4. ถ้า WebStorm ถาม npm install ให้กดเลย ไม่งั้นรันเอง:

```bash
npm install
```

5. ระหว่างรอ โหลดเอกสารที่จะใช้เก็บลงเครื่อง

✅ **ผ่านเมื่อ:** มีโฟลเดอร์ `node_modules` และไม่มี error สีแดง
⚠️ หลัง 15 นาที **ปิดเน็ต** · ถ้า install ไม่ผ่านให้ยกมือทันที

---

## เตรียมโปรเจกต์

### ขั้น 2: นำเข้าฐานข้อมูล (≈8 นาที)

**WebStorm:** แท็บ Database → คลิกขวา data source MySQL → **SQL Scripts → Run SQL Script…** → เลือก `init-database.sql` → Refresh แล้วเปิดให้แสดง schema `mobile_distributor`

หรือใช้ command line:

```bash
mysql -u root -p < database/init-database.sql
```

ตรวจผล (และดู**ชื่อคอลัมน์จริง** เผื่อต่างจากที่ซ้อม):

```sql
USE mobile_distributor;
SHOW TABLES;
SELECT COUNT(*) FROM products;   -- ซ้อมได้ 75
DESCRIBE products;
```

✅ **ผ่านเมื่อ:** เห็นตาราง brands, products และ products มี ≥ 50 แถว

### ขั้น 3: db-config และ script start (≈4 นาที)

- แก้ database เป็น `mobile_distributor` และใส่ user/password ให้ตรงเครื่อง · เพิ่ม `timezone: 'Z'` กันวันที่เลื่อน 7 ชม.
- เพิ่ม `"start"` ใน package.json (spec ให้รัน `npm start` แต่ template ไม่มี)

**`src/configs/db-config.js`**

```javascript
// 67130500001 - Kanokphon Sueby
import mysql from 'mysql2/promise'

// แก้ user / password ให้ตรงกับ MySQL ในเครื่องที่สอบ
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql@sit',
    database: 'mobile_distributor',
    timezone: 'Z',   // อ่าน/เขียน DATETIME เป็น UTC → created_at ตรง spec (2024-01-01T00:00:00.000Z)
})
export default db
```

**`package.json`**

```json
{
  "name": "express-template",
  "version": "1.0.0",
  "description": "",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "test": "node tests/test-runner.mjs"
  },
  "private": true,
  "dependencies": {
    "express": "^5.2.1",
    "http-status": "^2.1.0",
    "mysql2": "^3.24.3"
  }
}
```

### ขั้น 4: error-handler (≈5 นาที) ⭐ เขียนเอง

มี 3 ส่วน: `AppError` (throw พร้อม status), `notFound` (route ไม่มี → 404 JSON), `errorHandler` (4 parameter, ตอบ `success:false`, แปลง `ER_DUP_ENTRY` → 409)

**`src/middlewares/error-handler.js`**

```javascript
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
```

### ขั้น 5: แก้ pagination middleware (≈3 นาที)

บั๊กใน template: offset คำนวณจาก `pageSize` (ค่าดิบ) แทน `limit` ที่ตรวจแล้ว · และ page ต้อง default = 1

**`src/middlewares/pagination-middleware.js`**

```javascript
// 67130500001 - Kanokphon Sueby
// ใส่ page หรือ limit ตัวใดตัวหนึ่ง → แบ่งหน้า (spec: page default = 1)
// ไม่ใส่ทั้งคู่ → req.pagination = null (ส่งข้อมูลทั้งหมด)
export const queryParser = () => {
    return (req, res, next) => {
        const query = req.query || {}
        if (query.page === undefined && query.limit === undefined) {
            req.pagination = null
            return next()
        }
        const page = Math.max(parseInt(query.page) || 1, 1)              // ติดลบ / ไม่ใช่ตัวเลข → 1
        const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100) // 1..100
        const offset = (page - 1) * limit                                 // ใช้ limit ที่ตรวจแล้ว (template เดิมใช้ pageSize ผิด)
        req.pagination = {page, limit, offset}
        next()
    }
}
```

---

## ข้อ R: Identity

### ขั้น 6: app.js + student-info (≈7 นาที)

ลบ import ของ offices / productlines ออก · ตั้ง STUDENT_ID / ชื่อ / secret key ให้ **copy จาก spec** อย่าพิมพ์เอง

| ลำดับใน app.js | เหตุผล |
|---|---|
| 1. `express.json()` | ต้องมีก่อนถึงอ่าน `req.body` ได้ |
| 2. `queryParser()` | ต้องอยู่ก่อน router |
| 3. routes | ใต้ `/api/<รหัส>` |
| 4. `notFound` → `errorHandler` | ท้ายสุดเสมอ |

**`src/app.js`**

```javascript
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
```

รันและตรวจ:

```bash
# Terminal 1 (ค้างไว้)
npm start

# Terminal 2 (โฟลเดอร์ที่มี tests)
node tests/test-runner.mjs 67130500001
```

✅ **ผ่านเมื่อ:** `1. Identity 10/10` · เปิด `http://localhost:3000/api/67130500001/student-info` เห็น studentId, name, secretKey

---

## ข้อ R: Brands

### ขั้น 7: brand repository → service → route (≈10 นาที) (ไฟล์ใหม่)

spec ให้ส่งคอลัมน์ตามตาราง จึงไม่ต้องใช้ mapper

**`src/repositories/brand-repo.js`**

```javascript
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
```

**`src/services/brand-service.js`**

```javascript
// 67130500001 - Kanokphon Sueby
import * as repo from '../repositories/brand-repo.js'

// spec ให้ส่ง brand ตามคอลัมน์ในตาราง จึงไม่ต้องผ่าน mapper
export async function getAllObjects(pagination) {
    return await repo.findAll(pagination)
}

export async function getObject(id) {
    return await repo.findOne(id)
}
```

**`src/routes/brand-route.js`**

```javascript
// 67130500001 - Kanokphon Sueby
import * as service from '../services/brand-service.js'
import express from 'express'
import {apiResponse} from '../mappers/api-response.js'

const router = express.Router()

// Express 5: async error ถูกส่งเข้า errorHandler ให้อัตโนมัติ ไม่ต้อง try/catch
router.get('/', async (req, res) => {
    const pagination = req.pagination
    const objects = await service.getAllObjects(pagination)
    apiResponse(res, objects, pagination)
})

router.get('/:id', async (req, res) => {
    const object = await service.getObject(req.params.id)
    apiResponse(res, object)
})

export default router
```

✅ **ผ่านเมื่อ:** restart server แล้ว `2. Brands API 10/10` · `/brands/99999` ได้ 404

---

## ข้อ C / R / U / D: Products

### ขั้น 8: product repository (≈12 นาที)

เปลี่ยน `productCode` → `id` · JOIN brands เพื่อเอา `brand_name` · เช็ก SKU ซ้ำก่อน insert → 409 · ไม่พบ → throw `AppError(…, 404)`

**`src/repositories/product-repo.js`**

```javascript
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
```

⚠️ template เดิมใน `create()` ใช้ `data.productLine` ตายตัว ต้องแก้

### ขั้น 9: product mapper / DTO (≈10 นาที)

| DTO | ฟิลด์ |
|---|---|
| Summary (GET list) | `id, sku, name, brandId, category, price, status` |
| Detail (GET :id, POST, PUT) | + `brandName, ramGb, storageGb, color, stockQuantity, releaseDate` |

- `price`: mysql2 คืน DECIMAL เป็น string → `Number()`
- `releaseDate`: Date → `YYYY-MM-DD`

**`src/mappers/product-mapper.js`**

```javascript
// 67130500001 - Kanokphon Sueby

// DATE จาก MySQL มาเป็น JS Date (UTC เพราะตั้ง timezone: 'Z') → แปลงเป็น 'YYYY-MM-DD' ไม่ให้วันเลื่อนเพราะ timezone
function toDateString(value) {
    if (!(value instanceof Date)) return value ?? null
    const pad = n => String(n).padStart(2, '0')
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`
}

// DECIMAL จาก mysql2 มาเป็น string ('48900.00') → แปลงเป็น number
const toNumber = v => (v === null || v === undefined ? null : Number(v))

export default class ProductMapper {
    // Summary DTO: ใช้ตอน GET /products
    static toSummaryDTO(entity) {
        return {
            id: entity.id,
            sku: entity.sku,
            name: entity.name,
            brandId: entity.brand_id,
            category: entity.category,
            price: toNumber(entity.price),
            status: entity.status,
        }
    }

    // Detail DTO: ใช้ตอน GET /products/:id, POST, PUT
    static toDetailDTO(entity) {
        return {
            id: entity.id,
            sku: entity.sku,
            name: entity.name,
            brandId: entity.brand_id,
            brandName: entity.brand_name ?? null,
            category: entity.category,
            price: toNumber(entity.price),
            ramGb: entity.ram_gb,
            storageGb: entity.storage_gb,
            color: entity.color,
            stockQuantity: entity.stock_quantity,
            status: entity.status,
            releaseDate: toDateString(entity.release_date),
        }
    }

    static map(entity, viewType = 'full') {
        return viewType === 'summary' ? this.toSummaryDTO(entity) : this.toDetailDTO(entity)
    }

    static maps(entities, viewType = 'summary') {
        const list = entities.map(item => this.map(item, viewType))
        if (entities.totalItems !== undefined) list.totalItems = entities.totalItems // พก total ไปให้ apiResponse
        return list
    }
}
```

### ขั้น 10: product service (≈8 นาที)

เลือกเฉพาะคอลัมน์ที่อนุญาต · POST ขาดฟิลด์จำเป็น → 400 · ส่งผ่าน mapper ทุกครั้ง

**`src/services/product-service.js`**

```javascript
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
```

### ขั้น 11: product route + api-response (≈8 นาที)

POST → **201** · DELETE → **204 ไม่มี body** · ที่เหลือผ่าน `apiResponse` (มี `success` + `timestamp`)

**`src/routes/product-route.js`**

```javascript
// 67130500001 - Kanokphon Sueby
import * as service from '../services/product-service.js'
import express from 'express'
import httpStatus from 'http-status'
import {apiResponse} from '../mappers/api-response.js'

const router = express.Router()

// GET /products?page=1&limit=10  → Summary DTO + pagination
router.get('/', async (req, res) => {
    const pagination = req.pagination
    const viewType = req.query.view || 'summary'
    const objects = await service.getAllObjects(pagination, viewType)
    apiResponse(res, objects, pagination)
})

// GET /products/:id  → Detail DTO หรือ 404
router.get('/:id', async (req, res) => {
    const viewType = req.query.view || 'full'
    const object = await service.getObject(req.params.id, viewType)
    apiResponse(res, object)
})

// POST /products  → 201 หรือ 409 (SKU ซ้ำ) / 400 (ข้อมูลไม่ครบ)
router.post('/', async (req, res) => {
    const created = await service.createObject(req.body)
    apiResponse(res, created, null, httpStatus.CREATED)
})

// PUT /products/:id  → 200 หรือ 404
router.put('/:id', async (req, res) => {
    const updated = await service.updateObject(req.params.id, req.body)
    apiResponse(res, updated)
})

// DELETE /products/:id  → 204 ไม่มี body หรือ 404
router.delete('/:id', async (req, res) => {
    await service.removeObject(req.params.id)
    res.status(httpStatus.NO_CONTENT).end()
})

export default router
```

`api-response.js` ของ template ชุด OneDrive ใช้ได้เลย (มี timestamp แล้ว) ถ้าของวันสอบไม่มี ใช้ตัวนี้แทน:

**`src/mappers/api-response.js`**

```javascript
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
```

ลบ `office-*`, `productline-*` ทิ้งได้

✅ **ผ่านเมื่อ:** `3. Products Query 35/35` และ `4. Products Modify 30/30`

---

## ตรวจและส่ง

### ขั้น 12: รัน test ให้ครบแล้วไล่แก้ (≈15 นาที)

**restart server ทุกครั้งที่แก้ไฟล์** แล้วรัน `node tests/test-runner.mjs 67130500001` · ถ้าไม่ผ่าน ดูบรรทัด `↳ Reason`

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `Cannot connect to Express server` | server ไม่รัน/พังตอนเปิด | ดู error ใน Terminal 1 แล้ว `npm start` ใหม่ |
| `ERR_MODULE_NOT_FOUND` | path import ผิด / ลืม `.js` | ทุก import ลงท้าย `.js` |
| `does not provide an export named` | export ไม่ตรงกับ import | เช็ก `export` vs `export default` |
| `ER_ACCESS_DENIED_ERROR` | user/password DB ผิด | แก้ db-config |
| `ER_BAD_DB_ERROR` / `ER_NO_SUCH_TABLE` | ยังไม่รัน SQL | ทำขั้น 2 |
| `ER_BAD_FIELD_ERROR` | ชื่อคอลัมน์ไม่ตรง | `DESCRIBE products;` แล้วแก้ repo/mapper |
| `EADDRINUSE :3000` | server เก่ารันค้าง | ปิด terminal เก่า / Stop ใน WebStorm |
| studentId / secretKey mismatch | พิมพ์ผิด | copy จาก spec |
| `totalPages` เป็น null/NaN | ไม่ได้ใส่ `rows.totalItems = await count()` | ดู `findAll` |
| Summary DTO missing fields | mapper ยังเป็น classicmodels | ขั้น 9 |
| 404 test ได้ 500 | repo ไม่ throw AppError | ขั้น 8 |
| Duplicate ได้ 201 / ไม่มี `success:false` | ไม่ได้เช็ก SKU / handler ไม่ส่ง success | ขั้น 4, 8 |
| request ค้างไม่ตอบ | ไม่เรียก `next()` / error handler ว่าง | ขั้น 4, 5 |

ยิงดูผลเองด้วย curl (PowerShell ใช้ `curl.exe`):

```powershell
curl.exe -i "http://localhost:3000/api/67130500001/products?page=1&limit=2"
curl.exe -i http://localhost:3000/api/67130500001/products/99999
```

หรือสร้างไฟล์ `test.http` ใน WebStorm แล้วกด ▶ ข้างแต่ละ request:

```http
@base = http://localhost:3000/api/67130500001

### list
GET {{base}}/products?page=1&limit=2

### detail
GET {{base}}/products/1

### 404
GET {{base}}/products/99999

### create
POST {{base}}/products
Content-Type: application/json

{ "sku": "TEST-SKU-999", "name": "Test Phone 2026", "brand_id": 1, "category": "FLAGSHIP", "price": 29900 }

### duplicate → 409
POST {{base}}/products
Content-Type: application/json

{ "sku": "APL-IP15PM-256-NT", "name": "Dup", "brand_id": 1, "category": "FLAGSHIP", "price": 1 }
```

✅ **ผ่านเมื่อ:** `TOTAL SCORE 100 / 100`

### ขั้น 13: zip และส่งผ่าน LEB2 (≈10 นาที)

1. หยุด server (Ctrl+C) · เช็กคอมเมนต์ `// 67130500001 - Kanokphon Sueby` บนหัวไฟล์
2. บีบอัด**เฉพาะโฟลเดอร์งาน ไม่เอา `node_modules`** ชื่อ `67130500001_exam.zip`
3. วิธีง่าย: copy โฟลเดอร์ไปอีกที่ → ลบ `node_modules` ในตัว copy → คลิกขวา Send to → Compressed (zipped) folder
4. หรือ PowerShell (รันในโฟลเดอร์โปรเจกต์):

```powershell
Compress-Archive -Path (Get-ChildItem -Exclude node_modules) -DestinationPath ..\67130500001_exam.zip -Force
```

5. เปิด zip เช็กว่ามี `src`, `package.json` และ**ไม่มี** `node_modules` แล้วส่งใน LEB2

✅ **ผ่านเมื่อ:** zip ขนาดไม่กี่สิบ KB (ถ้าหลาย MB แปลว่า node_modules ติดไป)

---

## เช็กลิสต์สุดท้าย

- [ ] `"type": "module"` และทุก import ลงท้าย `.js`
- [ ] db-config ตรงเครื่อง (`mobile_distributor`, user, password)
- [ ] ลำดับ app.js: `express.json()` → `queryParser()` → routes → `notFound` → `errorHandler`
- [ ] path ตรง spec: `/api/<รหัส>/...` ใช้คำนามพหูพจน์
- [ ] status: POST 201 · ไม่พบ 404 · ข้อมูลไม่ครบ 400 · ซ้ำ 409 · DELETE 204
- [ ] response ตรง spec ทุก key (`success`, `data`, `pagination`, `timestamp`)
- [ ] DTO ตัด/เปลี่ยนชื่อ field ตาม spec · price เป็นตัวเลข
- [ ] test-runner ได้ 100 · zip ไม่มี node_modules · ส่งใน LEB2 แล้ว
