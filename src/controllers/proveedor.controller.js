import { pool } from '../db.js'

export const getProveedores = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cod_proveedor, nombre, direccion, telefono, nit FROM jirehdb.tbl_proveedor');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getProveedor = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa, cod_proveedor, nombre, direccion, telefono, pagina_web, nom_contacto, nit FROM jirehdb.tbl_proveedor; WHERE cod_empresa = ? and cod_proveedor = ?', [req.params.cod_empresa, req.params.cod_proveedor]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Proveedor no existe'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createProveedor = async(req, res) => {
    //console.log(req.body)
    const Proveedor = {
        cod_empresa: req.body.cod_empresa,
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        nit: req.body.nit
    }
    try {
        const [rows] = await pool.query('CALL PR_PROVEEDOR(?,?,?,?,?)', [Proveedor.cod_empresa, Proveedor.nombre, Proveedor.direccion, Proveedor.telefono, Proveedor.nit])

        console.log(rows[0][0].p_id)
        res.send({
            cod_empresa: Proveedor.cod_empresa,
            cod_proveedor: rows[0][0].p_id,
            nombre: Proveedor.nombre,
            direccion: Proveedor.direccion,
            telefono: Proveedor.telefono,
            nit: Proveedor.nit
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateProveedor = async(req, res) => {
    const { nombre, direccion, telefono, nit, cod_empresa, cod_proveedor } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_proveedor SET nombre = IFNULL(?, nombre),direccion = IFNULL(?, direccion),telefono = IFNULL(?, telefono),nit = IFNULL(?, nit) WHERE cod_empresa = ? and cod_proveedor = ?', [nombre, direccion, telefono, nit, cod_empresa, cod_proveedor])
            //console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
                message: 'Proveedor no existe'
            })
            //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        //console.log(error.message)
        return res.status(500).json({
            message: 'error al actualizar Proveedor'
        })
    }
}

export const deleteProveedor = async(req, res) => {
    //console.log("Llegue " + JSON.stringify(req.body))
    const { cod_empresa, cod_proveedor } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_proveedor WHERE cod_empresa = ? and cod_proveedor = ?', [cod_empresa, cod_proveedor]);
        //console.log([result])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Proveedor no Existe'
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