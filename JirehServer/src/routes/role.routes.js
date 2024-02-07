import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createRole, deleteRole, getRole, getRoles, updateRole } from '../controllers/role.controller.js'

const roleRouter = Router()

roleRouter.get('/roles', verifyToken, getRoles)
roleRouter.get('/role/:id', verifyToken, getRole)
roleRouter.post('/role', createRole)
roleRouter.patch('/role/:id', verifyToken, updateRole)
roleRouter.delete('/role/:id', verifyToken, deleteRole)

export default roleRouter;