import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createBodega, deleteBodega, getBodega, getBodegas, updateBodega } from '../controllers/bodega.controller.js'

const bodegaRouter = Router()

bodegaRouter.get('/bodegas', verifyToken, getBodegas)
bodegaRouter.get('/bodega/:id', verifyToken, getBodega)
bodegaRouter.post('/bodega', verifyToken, createBodega)
bodegaRouter.patch('/bodega', verifyToken, updateBodega)
bodegaRouter.delete('/bodega', verifyToken, deleteBodega)

export default bodegaRouter;