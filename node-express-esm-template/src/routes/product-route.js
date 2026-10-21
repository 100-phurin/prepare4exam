import * as service from "../services/product-service.js"
import express from "express"
import {apiResponse} from "../mappers/api-response.js";
import httpStatus from "http-status";

const router = express.Router()

router.get("/", async (req, res) => {
    const { pagination } = req;
    const objects = await service.getAllObjects(pagination,req.query.view);
    return apiResponse(res, objects, pagination);
});

router.get("/:id", async (req, res) => {
    const object = await service.getObject(req.params.id);
    return apiResponse(res, object);
});

router.post("/", async (req, res) => {
    const result = await service.createObject(req.body);
    return apiResponse(res, result, null, httpStatus.CREATED);
});

router.put("/:id", async (req, res) => {
    const object = await service.updateObject(req.params.id, req.body);
    return apiResponse(res, object);
});

router.delete("/:id", async (req, res) => {
    await service.removeObject(req.params.id);
    return res.status(httpStatus.NO_CONTENT).end();
});

export default router;