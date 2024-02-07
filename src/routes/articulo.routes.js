import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createArticulo, deleteArticulo, getArticulo, getArticulos, updateArticulo } from '../controllers/articulo.controller.js'

const articuloRouter = Router()

articuloRouter.get('/articulos', verifyToken, getArticulos)
articuloRouter.get('/articulo/:empresa/:id', verifyToken, getArticulo)
articuloRouter.post('/articulo', createArticulo)
articuloRouter.post('/lstarticulo', createArticulo)
articuloRouter.patch('/articulo', verifyToken, updateArticulo)
articuloRouter.delete('/articulo', verifyToken, deleteArticulo)

export default articuloRouter;