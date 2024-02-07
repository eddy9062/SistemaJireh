import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createProveedor, deleteProveedor, getProveedor, getProveedores, updateProveedor } from '../controllers/proveedor.controller.js'

const proveedorRouter = Router()

proveedorRouter.get('/proveedores', verifyToken, getProveedores)
proveedorRouter.get('/proveedor/:id', verifyToken, getProveedor)
proveedorRouter.post('/proveedor', verifyToken, createProveedor)
proveedorRouter.patch('/proveedor', verifyToken, updateProveedor)
proveedorRouter.delete('/proveedor', verifyToken, deleteProveedor)

export default proveedorRouter;