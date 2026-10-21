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
