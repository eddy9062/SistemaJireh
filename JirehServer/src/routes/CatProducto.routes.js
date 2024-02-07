import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createCatProducto, deleteCatProducto, getCatProducto, getCatProductos, updateCatProducto } from '../controllers/catproducto.controller.js'

const catproductoRouter = Router()

catproductoRouter.get('/categorias', verifyToken, getCatProductos)
catproductoRouter.get('/categoria/:id', verifyToken, getCatProducto)
catproductoRouter.post('/categoria', verifyToken, createCatProducto)
catproductoRouter.patch('/categoria', verifyToken, updateCatProducto)
catproductoRouter.delete('/categoria', verifyToken, deleteCatProducto)

export default catproductoRouter;