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
