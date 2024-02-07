import express from 'express'
import userRouter from './routes/users.routes.js'
import roleRouter from './routes/role.routes.js'
import clienteRouter from './routes/cliente.routes.js'
import cors from 'cors'
import proveedorRouter from './routes/proveedor.routes.js'
import bodegaRouter from './routes/bodega.routes.js'
import catproductoRouter from './routes/CatProducto.routes.js'
import articuloRouter from './routes/articulo.routes.js'
import tareaRouter from './routes/tarea.routes.js'


//Config Server
const app = express()
    //Config Cors
app.use(cors())
app.use(express.json())
    //Routers
app.use('/api', userRouter);
app.use('/api', roleRouter);
app.use('/api', clienteRouter);
app.use('/api', proveedorRouter);
app.use('/api', bodegaRouter);
app.use('/api', catproductoRouter);
app.use('/api', articuloRouter);
app.use('/api', tareaRouter);


app.use((req, res, next) => {
    res.status(404).json({
        message: 'end point not found'
    })
})

export default app;