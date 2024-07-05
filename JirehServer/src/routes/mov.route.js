import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { getArticulos } from '../controllers/mov.controller.js'

const movRouter = Router()

movRouter.get('/mov_articulos/:texto', verifyToken, getArticulos)
/*articuloRouter.get('/articulo/:empresa/:id', verifyToken, getArticulo)
articuloRouter.post('/articulo', createArticulo)
//articuloRouter.post('/lstarticulo', createArticulo)
articuloRouter.patch('/articulo', verifyToken, updateArticulo)
articuloRouter.delete('/articulo', verifyToken, deleteArticulo)
articuloRouter.delete('/det_articulo', verifyToken, deleteDetArticulo)

articuloRouter.post('/lstdetarticulo', getDetArticulo)
articuloRouter.post('/det_articulo', updateDetArticulo)*/


export default movRouter;