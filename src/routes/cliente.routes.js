import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createCliente, deleteCliente, getCliente, getClientes, updateCliente } from '../controllers/cliente.controller.js'

const clienteRouter = Router()

clienteRouter.get('/clientes', verifyToken, getClientes)
clienteRouter.get('/cliente/:id', verifyToken, getCliente)
clienteRouter.post('/cliente', createCliente)
clienteRouter.patch('/cliente', verifyToken, updateCliente)
clienteRouter.delete('/cliente', verifyToken, deleteCliente)

export default clienteRouter;