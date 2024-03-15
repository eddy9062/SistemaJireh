import { pool } from '../db.js'

export const getCatProductos = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cat_articulo, descripcion FROM jirehdb.tbl_cat_articulo');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCatProducto = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cat_articulo, descripcion FROM jirehdb.tbl_cat_articulo WHERE cod_empresa = ? and cat_articulo = ?', [req.params.cat_articulo]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Categoria Producto no existe'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createCatProducto = async(req, res) => {
    //console.log(req.body)
    const CatProducto = {
        descripcion: req.body.descripcion
    }
    try {
        const [rows] = await pool.query('CALL PR_CAT_PRODUCTO(?)', [CatProducto.descripcion])
            //        console.log(rows[0][0].p_id)
        res.send({
            cat_articulo: rows[0][0].p_id,
            descripcion: CatProducto.descripcion
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateCatProducto = async(req, res) => {
    const { descripcion, cod_empresa, cat_articulo } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_cat_articulo SET descripcion = IFNULL(?, descripcion) WHERE cat_articulo = ?', [descripcion, cat_articulo])
            //console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
                message: 'Categoria Producto no existe'
            })
            //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        //console.log(error.message)
        return res.status(500).json({
            message: 'error al actualizar Categoria Producto'
        })
    }
}

export const deleteCatProducto = async(req, res) => {
    //console.log("Llegue " + JSON.stringify(req.body))
    const { cat_articulo } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_cat_articulo WHERE cat_articulo = ?', [cat_articulo]);
        //console.log([result])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Categoria Producto no Existe'
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