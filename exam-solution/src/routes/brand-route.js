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
