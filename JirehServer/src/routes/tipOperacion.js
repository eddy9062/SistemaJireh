import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createTipOperacion, deleteTipOperacion, getTipOperacion, getTipOperaciones, updateTipOperacion } from '../controllers/tipOper.controller.js'

const tipOperaRouter = Router()

tipOperaRouter.get('/operaciones', verifyToken, getTipOperaciones)
tipOperaRouter.get('/operacion/:id', verifyToken, getTipOperacion)
tipOperaRouter.post('/operacion', verifyToken, createTipOperacion)
tipOperaRouter.patch('/operacion', verifyToken, updateTipOperacion)
tipOperaRouter.delete('/operacion', verifyToken, deleteTipOperacion)

export default tipOperaRouter;