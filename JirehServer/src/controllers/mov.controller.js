import { pool } from '../db.js'


export const getArticulos = async (req, res) => {

    console.log(req.params['texto'])

    const _cadena = '%'+req.params['texto']+'%'
    
    try {
        const [rows] = await pool.query('SELECT cod_articulo, cod_det_articulo, descripcion, precio_venta, unidades, cant_mayoreo, precio_mayoreo FROM jirehdb.tbl_det_articulo where CONCAT(COD_ARTICULO, DESCRIPCION) LIKE ?', [_cadena]);
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
/*
export const getArticulo = async (req, res) => {
    console.log(req.body)

    const Articulo = {
        cat_articulo: req.body.cat_articulo,
        cod_articulo: req.body.cod_articulo,
    }
    try {
        const [rows] = await pool.query('SELECT cat_articulo, cod_articulo, descripcion, obs FROM jirehdb.tbl_articulo WHERE cat_articulo = ? and cod_articulo = ?', [cat_articulo, cod_articulo]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Articulo no existe'
        })

        let data = {
            name: "GFG",
            age: 18,
            male: true
        }
 
        res.json(rows)
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const getDetArticulo = async (req, res) => {
    //console.log(req.body)

    const Articulo = {
        cat_articulo: req.body.cat_articulo,
        cod_articulo: req.body.cod_articulo,
    }
    try {
        const [rows] = await pool.query('select cat_articulo, cod_articulo,cod_det_articulo,descripcion,precio_venta,unidades,cant_mayoreo,precio_mayoreo from TBL_DET_ARTICULO WHERE cat_articulo = ? and cod_articulo = ?', [Articulo.cat_articulo, Articulo.cod_articulo]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'No existe detalle de articulo'
        })
 
        res.json(rows)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor '+error.message
        })
    }
}

export const createArticulo = async (req, res) => {
    console.log(req.body)
    const dataArticulo = req.body;
    
    try {
        const [rows] = await pool.query('CALL PR_PRODUCTO(?,?,?,?)', [dataArticulo.cat_articulo,dataArticulo.cod_articulo, dataArticulo.descripcion,dataArticulo.obs])
        //console.log(rows[0][0].p_id)
        //console.log(rows)
        try {
            for (const element of dataArticulo.det) {
                const [rows1] = await pool.query('CALL PR_DET_PRODUCTO(?,?,?,?,?,?,?,?)', [element.cat_articulo, element.cod_articulo,element.cod_det_articulo, element.descripcion, element.precio_venta, element.unidades, element.cant_mayoreo, element.precio_mayoreo])
            };
        } catch (error) {
          //  console.log(error)
            return res.status(500).json({
                message: 'error en el Servidor ' + error.message
            })
        }
        res.send({ message: 'Ok' })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: 'error en el Servidor ' + error.message
        })
    }
}

export const updateArticulo = async (req, res) => {
    const { cat_articulo, cod_articulo, descripcion, obs } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_articulo SET descripcion = IFNULL(?, descripcion), obs = IFNULL(?, obs) WHERE cat_articulo = ? and cod_articulo = ?', [descripcion, obs, cat_articulo, cod_articulo])
        console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Articulo no existe'
        })
        //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        return res.status(500).json({
            message: 'error al actualizar Articulo'
        })
    }
}

export const deleteArticulo = async (req, res) => {
    console.log("Llegue " + JSON.stringify(req.body))
    const { cod_articulo } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_articulo WHERE cod_articulo = ?', [cod_articulo]);
        console.log([result])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuario no Existe'
        })
        if (result.affectedRows != 1) {
            return res.status(404).json({
                message: 'Servidor: Error al Eliminar Registro'
            })
        }
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor '+error.message
        })
    }
}

export const deleteDetArticulo = async (req, res) => {
    console.log("Llegue " + JSON.stringify(req.body))
    const { cat_articulo, cod_articulo, cod_det_articulo } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM jirehdb.tbl_det_articulo WHERE cat_articulo = ? AND cod_articulo = ? AND cod_det_articulo = ?', [cat_articulo,cod_articulo,cod_det_articulo]);
        console.log([result])
        if (result.affectedRows != 1) {
            return res.status(404).json({
                message: 'Servidor: Error al Eliminar Registro'
            })
        }
        res.json(result.affectedRows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor '+error.message
        })
    }
}


// Detalle de productos
export const createDetArticulo = async (req, res) => {
    console.log(req.body)
    const DetArticulo = {
        cod_empresa: req.body.cod_empresa,
        cat_articulo: req.body.cat_articulo,
        cod_articulo: req.body.cod_articulo,
        cod_det_articulo: req.body.cod_det_articulo,
        descripcion: req.body.descripcion,
        precio_venta: req.body.precio_venta,
        unidades: req.body.unidades,
        cant_mayoreo: req.body.cant_mayoreo,
        precio_mayoreo: req.body.precio_mayoreo
    }
    try {
        const [rows] = await pool.query('CALL PR_DET_PRODUCTO(?,?,?,?,?,?,?,?,?)', [DetArticulo.cod_empresa, DetArticulo.cat_articulo, DetArticulo.cod_articulo, DetArticulo.cod_det_articulo, DetArticulo.descripcion, DetArticulo.precio_venta, DetArticulo.unidades, DetArticulo.cant_mayoreo, DetArticulo.precio_mayoreo])
        //console.log(rows[0][0].p_id)
        res.send({
            cod_det_articulo: rows[0][0].p_id,
            cod_empresa: DetArticulo.cod_empresa,
            cod_articulo: DetArticulo.cod_articulo,
            cod_det_articulo: DetArticulo.cod_det_articulo,
            descripcion: DetArticulo.descripcion,
            precio_venta: DetArticulo.precio_venta,
            unidades: DetArticulo.unidades,
            cant_mayoreo: DetArticulo.cant_mayoreo,
            precio_mayoreo: DetArticulo.precio_mayoreo

        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateDetArticulo = async (req, res) => {
    const { cant_mayoreo,cat_articulo,cod_articulo,cod_det_articulo,descripcion,precio_mayoreo,precio_venta,unidades} = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_det_articulo SET descripcion = IFNULL(?, descripcion),precio_venta = IFNULL(?, precio_venta),unidades = IFNULL(?, unidades),cant_mayoreo = IFNULL(?, cant_mayoreo),precio_mayoreo = IFNULL(?, precio_mayoreo) WHERE cat_articulo = ? and cod_articulo = ? and cod_det_articulo = ?', [descripcion, precio_venta, unidades, cant_mayoreo, precio_mayoreo, cat_articulo,cod_articulo, cod_det_articulo])
        console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Detalle der Articulo no existe'
        })
        //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        return res.status(500).json({
            message: 'error al actualizar Detalle Articulo'
        })
    }
    
}*/