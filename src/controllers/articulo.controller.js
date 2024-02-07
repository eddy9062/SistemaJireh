import { pool } from '../db.js'


export const getArticulos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cat_articulo, cod_bodega, cod_articulo, descripcion, existencia, precio_compra, obs FROM jirehdb.tbl_articulo');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getArticulo = async (req, res) => {
    console.log(req.body)

    const Articulo = {
        cod_empresa: req.body.cod_empresa,
        cat_articulo: req.body.cat_articulo,
        cod_bodega: req.body.cod_bodega,
        cod_articulo: req.body.cod_articulo,
    }
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cat_articulo, cod_bodega, cod_articulo, descripcion, existencia, precio_compra, obs FROM jirehdb.tbl_articulo WHERE cod_empresa = ? and cod_bodega = ? and cat_articulo = ? and cod_articulo = ?', [cod_empresa, cod_bodega, cat_articulo, cod_articulo]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Articulo no existe'
        })

        let data = {
            name: "GFG",
            age: 18,
            male: true
        }
        //this.item = response as unknown as ArticuloModel;

        /*
        select cod_det_articulo,descripcion, precio_venta,unidades 
from tbl_det_articulo tda 
where cod_empresa = 1
  and cat_articulo = 1
  and cod_articulo = 'A1'
        */
        res.json(rows)
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createArticulo = async (req, res) => {
    //console.log(req.body)
    const dataArticulo = req.body;

    
    try {
        const [rows] = await pool.query('CALL PR_PRODUCTO(?,?,?,?,?,?,?,?)', [dataArticulo.cod_empresa, dataArticulo.cat_articulo, dataArticulo.cod_bodega, dataArticulo.cod_articulo, dataArticulo.descripcion, dataArticulo.existencia, dataArticulo.precio_compra, dataArticulo.obs])
        //console.log(rows[0][0].p_id)
        try {

            dataArticulo.det.forEach( async element => {
                const [rows1] = await pool.query('CALL PR_DET_PRODUCTO(?,?,?,?,?,?,?,?)', [element.cod_empresa, element.cat_articulo, element.cod_articulo, element.descripcion, element.precio_venta, element.unidades, element.cant_mayoreo, element.precio_mayoreo])
                                //console.log(rows1)
            });
          
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'error en el Servidor ' + error
            })
        }
        res.send({ message: 'Ok' })
        /*res.send({
            cod_empresa: Articulo.cod_empresa,
            cod_bodega: Articulo.cod_bodega,
            cat_articulo: Articulo.cat_articulo,
            cod_articulo: Articulo.cod_articulo,
            descripcion: Articulo.descripcion,
            existencia: Articulo.existencia,
            precio_compra: Articulo.precio_compra,
            obs: Articulo.obs
        })*/
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateArticulo = async (req, res) => {
    const { cod_empresa, cod_cliente, nombre, direccion, telefono, nit } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_articulo SET cod_bodega = IFNULL(?, cod_bodega),cod_articulo = IFNULL(?, cod_articulo),descripcion = IFNULL(?, descripcion),existencia = IFNULL(?, existencia),precio_compra = IFNULL(?, precio_compra),obs = IFNULL(?, obs) WHERE cod_empresa = ? and cod_articulo = ?', [cod_bodega, cod_articulo, descripcion, existencia, precio_compra, obs, cod_empresa, cod_articulo])
        console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Usuario no existe'
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
    const { cod_empresa, cod_cliente } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_articulo WHERE cod_empresa = ? and cod_articulo = ?', [cod_empresa, cod_articulo]);
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
            message: 'error en el Servidor'
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
    const { cod_empresa, cod_cliente, nombre, direccion, telefono, nit } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_det_articulo SET cod_articulo = IFNULL(?, cod_articulo),cod_det_articulo = IFNULL(?, cod_det_articulo),descripcion = IFNULL(?, descripcion),precio_venta = IFNULL(?, precio_venta),unidades = IFNULL(?, unidades),cant_mayoreo = IFNULL(?, cant_mayoreo),cant_mayoreo = IFNULL(?, cant_mayoreo),precio_mayoreo = IFNULL(?, precio_mayoreo) WHERE cod_empresa = ? and cod_det_articulo = ?', [cod_articulo, cod_det_articulo, descripcion, precio_venta, unidades, cant_mayoreo, precio_mayoreo, cod_empresa, cod_det_articulo])
        console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Usuario no existe'
        })
        //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        return res.status(500).json({
            message: 'error al actualizar Articulo'
        })
    }
}

export const deleteDetArticulo = async (req, res) => {
    console.log("Llegue " + JSON.stringify(req.body))
    const { cod_empresa, cod_cliente } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_det_articulo WHERE cod_empresa = ? and cod_det_articulo = ?', [cod_empresa, cod_det_articulo]);
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
            message: 'error en el Servidor'
        })
    }
}