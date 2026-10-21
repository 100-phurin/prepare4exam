# เฉลยซ้อมสอบปฏิบัติ INT161: Mobile Phone Distributor

ทำตาม `exam-spec-67130500001.md` แล้ว `tests/test-runner.mjs` ได้ **100/100**

## วิธีรัน
```bash
# 1) สร้างฐานข้อมูล (ไฟล์นี้จำลองจาก spec; วันสอบให้ใช้ init-database.sql ของอาจารย์)
mysql -u root -p < database/init-database.sql

# 2) ติดตั้งและรัน
npm install
npm start

# 3) เปิดอีก terminal แล้วตรวจคะแนน
node tests/test-runner.mjs 67130500001
```
- แก้ user/password ของ MySQL ที่ `src/configs/db-config.js`
- ถ้าจะซ้อมด้วยรหัสอื่น ให้แก้ 3 บรรทัดบนสุดของ `src/app.js` (STUDENT_ID, STUDENT_NAME, SECRET_KEY)
- `student.csv` ใช้กับ test runner เพื่อให้ตรวจ secretKey ด้วย (ถ้าไม่มีไฟล์นี้ runner จะไม่ตรวจ secretKey)

## สิ่งที่เปลี่ยนจาก template
| ไฟล์ | เปลี่ยนอะไร | ทำไม |
|---|---|---|
| `package.json` | เพิ่ม `"start": "node src/app.js"` | spec ให้รันด้วย `npm start` แต่ template ไม่มี script นี้ |
| `app.js` | ตั้ง STUDENT_ID, เพิ่ม `/student-info`, ผูก brands/products, เพิ่ม `notFound`, ย้าย errorHandler ไว้ท้ายสุด | path ต้องเป็น `/api/<รหัส>/...` |
| `db-config.js` | database `mobile_distributor`, `timezone: 'Z'` | ให้ `created_at` ออกมาเป็น `2024-01-01T00:00:00.000Z` ตรง spec ไม่เลื่อนไป 7 ชม. |
| `pagination-middleware.js` | offset ใช้ `limit` แทน `pageSize`, page default 1 | บั๊กเดิม: `limit=500` แต่ offset คำนวณจาก 500 |
| `error-handler.js` | เพิ่ม `notFound`, รองรับ `err.status` และ JSON พัง → 400 | ทุก error ตอบ `success:false` + timestamp |
| `api-response.js` | ไม่ใช้ async แล้ว | ไม่จำเป็น |
| `brand-*` (ใหม่) | GET list และ GET by id → 404 | spec 2.2 |
| `product-repo.js` | ใช้ `id` แทน `productCode`, JOIN brands เอา `brand_name`, เช็ก SKU ซ้ำ → 409 | spec 2.3 |
| `product-mapper.js` | Summary/Detail DTO ตาม spec, price → number, release_date → `YYYY-MM-DD` | mysql2 คืน DECIMAL เป็น string |
| `product-service.js` | whitelist field, ตรวจ field ที่จำเป็น → 400 | กัน client ส่ง id/created_at มาเขียนทับ |
| `product-route.js` | POST → 201, DELETE → 204 ไม่มี body | spec |

ลบไฟล์ของ classicmodels (offices, productlines) ออก เพราะไม่ได้ใช้ในข้อสอบนี้
