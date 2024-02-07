import { pool } from '../db.js'

export const getClientes = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa,cod_cliente,nombre,direccion,telefono,nit FROM jirehdb.tbl_cliente');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCliente = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empresa,cod_cliente,nombre,direccion,telefono,nit FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [req.params.cod_empresa, req.params.cod_cliente]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Usuario no existe'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createCliente = async(req, res) => {
    //console.log(req.body)
    const Cliente = {
        cod_empresa: req.body.cod_empresa,
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        nit: req.body.nit
    }
    try {
        const [rows] = await pool.query('CALL PR_CLIENTE(?,?,?,?,?)', [Cliente.cod_empresa, Cliente.nombre, Cliente.direccion, Cliente.telefono, Cliente.nit])

        //console.log(rows[0][0].p_id)
        res.send({
            cod_cliente: rows[0][0].p_id,
            cod_empresa: Cliente.cod_empresa,
            nombre: Cliente.nombre,
            direccion: Cliente.direccion,
            telefono: Cliente.telefono,
            nit: Cliente.nit
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateCliente = async(req, res) => {
    const { cod_empresa, cod_cliente, nombre, direccion, telefono, nit } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_cliente SET nombre = IFNULL(?, nombre), direccion = IFNULL(?, direccion), telefono = IFNULL(?, telefono), nit = IFNULL(?, nit) WHERE cod_empresa = ? and cod_cliente = ?', [nombre, direccion, telefono, nit, cod_empresa, cod_cliente])
        console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
                message: 'Usuario no existe'
            })
            //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        return res.status(500).json({
            message: 'error al actualizar Cliente'
        })
    }
}

export const deleteCliente = async(req, res) => {
    console.log("Llegue " + JSON.stringify(req.body))
    const { cod_empresa, cod_cliente } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
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