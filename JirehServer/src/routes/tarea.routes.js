import { Router } from 'express'
import { verifyToken } from '../controllers/auth.controller.js'
import { createTarea, getTarea, getTareas,deleteTarea, getResumen } from '../controllers/tarea.controller.js'

const tareaRouter = Router()

tareaRouter.get('/tareas', verifyToken, getTareas)
tareaRouter.get('/tareas/:id_usuario/:fecha', verifyToken, getTareas)
tareaRouter.get('/resumen/:id_usuario', verifyToken, getResumen)
tareaRouter.post('/tareas', createTarea)
tareaRouter.delete('/tarea', verifyToken, deleteTarea)

//tareaRouter.patch('/tarea', verifyToken, updateArticulo)
//tareaRouter.delete('/tarea', verifyToken, deleteArticulo)

export default tareaRouter;