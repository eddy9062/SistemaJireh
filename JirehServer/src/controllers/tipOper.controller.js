import { pool } from '../db.js'

export const getTipOperaciones = async(req, res) => {
    try {
        const [rows] = await pool.query('select cod_tipo, des_tipo from jirehdb.TBL_TIPO_OPERACION');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getTipOperacion = async(req, res) => {
    try {
        const [rows] = await pool.query('select cod_tipo, des_tipo from jirehdb.tbl_tipo_operacion WHERE cod_tipo = ?', [req.params.cod_tipo]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Tipo de operación no existe'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createTipOperacion = async(req, res) => {
    //console.log(req.body)
    const TipOper = {
        des_tipo: req.body.des_tipo,
    }
    try {
        const [rows] = await pool.query('CALL PR_TIPO_OPER(?)', [TipOper.des_tipo])

        // console.log(rows[0][0].p_id)
        res.send({
            cod_tipo: rows[0][0].p_id,
            des_tipo: TipOper.des_tipo,
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateTipOperacion = async(req, res) => {
    const { des_tipo,cod_tipo } = req.body;
    try {
        const [result] = await pool.query('UPDATE tbl_tipo_operacion SET des_tipo = IFNULL(?, des_tipo) WHERE cod_tipo = ?', [des_tipo,cod_tipo])
            //console.log(result.changedRows)
        if (result.affectedRows === 0) return res.status(404).json({
                message: 'Tipo de operación no existe'
            })
            //const [rows] = await pool.query('SELECT * FROM tbl_cliente WHERE cod_empresa = ? and cod_cliente = ?', [cod_empresa, cod_cliente]);
        res.json(result.changedRows)
    } catch (error) {
        //console.log(error.message)
        return res.status(500).json({
            message: 'error al actualizar Tipo operacion'
        })
    }
}

export const deleteTipOperacion = async(req, res) => {
    console.log("Llegue " + JSON.stringify(req.body))
    const { cod_tipo } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_tipo_operacion WHERE cod_tipo = ?', [cod_tipo]);
        //console.log([result])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Tipo operación no Existe'
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