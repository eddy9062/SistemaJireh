import { Router } from 'express'
import { Autentica, TokenValido, getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/user.controller.js'
import { verifyToken } from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', Autentica)
router.get('/verificaToken', verifyToken, TokenValido)

router.get('/user', verifyToken, getUsuarios)
router.get('/user/:id', verifyToken, getUsuario)
router.post('/user', createUsuario)
router.patch('/user/:id', verifyToken, updateUsuario) //para actualizar parcialmente de lo contrario usar put
router.delete('/user/:id', verifyToken, deleteUsuario)

export default router;