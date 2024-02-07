import { pool } from '../db.js'

export const getBodegas = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cod_bodega, nombre, descripcion FROM jirehdb.tbl_bodega');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getBodega = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cod_bodega, nombre, descripcion FROM jirehdb.tbl_bodega WHERE cod_empresa = ? and cod_bodega = ?', [req.params.cod_empresa, req.params.cod_bodega]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Bodega no existe'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createBodega = async(req, res) => {
    //console.log(req.body)
    const Bodega = {
        cod_empresa: req.body.cod_empresa,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }
    try {
        const [rows] = await pool.query('CALL PR_BODEGA(?,?,?)', [Bodega.cod_empresa, Bodega.nombre, Bodega.descripcion])

        // console.log(rows[0][0].p_id)
        res.send({
            cod_bodega: rows[0][0].p_id,
            cod_empresa: Bodega.cod_empresa,
            nombre: Bodega.nombre,
            descripcion: Bodega.descripcion

        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateBodega = async(req, res) => {
    const { nombre, descripcion, cod_empresa, cod_bodega } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_bodega SET nombre = IFNULL(?, nombre),descripcion = IFNULL(?, descripcion) WHERE cod_empresa = ? and cod_bodega = ?', [nombre, descripcion, cod_empresa, cod_bodega])
            //console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
                message: 'Bodega no existe'
            })
            //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        //console.log(error.message)
        return res.status(500).json({
            message: 'error al actualizar Bodega'
        })
    }
}

export const deleteBodega = async(req, res) => {
    //console.log("Llegue " + JSON.stringify(req.body))
    const { cod_empresa, cod_bodega } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_bodega WHERE cod_empresa = ? and cod_bodega = ?', [cod_empresa, cod_bodega]);
        //console.log([result])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Bodega no Existe'
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