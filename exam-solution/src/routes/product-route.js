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
