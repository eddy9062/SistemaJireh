import { pool } from '../db.js'

export const getRoles = async(req, res) => {
    //console.log(req.token)

    try {
        //throw new Error('Ere')
        const [rows] = await pool.query('SELECT cod_empresa, cod_role, role FROM jirehdb.tbl_role');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}

export const getRole = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
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

export const createRole = async(req, res) => {
    //console.log(req.body)
    const User = {
        cod_empresa: req.body.cod_empresa,
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        roles: req.body.roles,
        password: await encrypt(req.body.password)
    }

    // console.log(User)

    try {
        const [rows] = await pool.query('CALL PR_USER(?,?,?,?,?)', [User.cod_empresa, User.usuario, User.nombre, User.roles, User.password])

        //console.log(rows[0][0].p_id)
        res.send({
                id: rows[0][0].p_id,
                cod_empresa: User.cod_empresa,
                usuario: User.usuario,
                nombre: User.nombre,
                token: await jwt.sign({ user: User }, 'secretkey')
            })
            /*export const jwttoken = await jwt.sign({user}, 'secretkey', (err, token) => {
                return token
            });*/

    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor ' + error
        })
    }
}

export const updateRole = async(req, res) => {
    const { id } = req.params
    const { usuario, nombre, roles, password } = req.body;
    try {
        const [result] = await pool.query('UPDATE user SET usuario = IFNULL(?, usuario), nombre = IFNULL(?, nombre), roles = IFNULL(?, roles), password = IFNULL(?, password) WHERE id = ?', [usuario, nombre, roles, password, id])
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Usuario no existe'
        })
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const deleteRole = async(req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM user WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuario no Existe'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }

}