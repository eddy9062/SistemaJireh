import { pool } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { SECRET } from '../config.js'
import { json } from 'express'

export const Autentica = async (req, res) => {

    console.log('Server ' + req);

    const User = {
        usuario: req.body.usuario,
        password: req.body.password
    }
    console.log('Server ' + JSON.stringify(User));
    //console.log('Server ' + pool.getConnection);

    try {
        const [rows] = await pool.query('SELECT * FROM tbl_user WHERE usuario = ?', [User.usuario])


        console.log(rows)
        if (rows.length <= 0) {
            //console.log('entre ')
            return res.status(404).send({
                message: 'Usuario no existe'
            })
        }
        bcrypt.compare(User.password, rows[0].password, async (err, check) => {
            //   console.log(check)
            if (check) {
                res.status(200).send({
                    id: rows[0].id,
                    cod_empresa: rows[0].cod_empresa,
                    usuario: rows[0].usuario,
                    nombre: rows[0].nombre,
                    role: rows[0].roles,
                    token: await jwt.sign({ id_usuario: rows[0].id,usuario: rows[0].usuario, clave: rows[0].password, cod_empresa: rows[0].cod_empresa, groups: [String(rows[0].role)] }, SECRET, {
                        expiresIn: "15d"
                    }),
                });
            } 
            else {
                //return res.status(403).json({ message: 'El usuario o ontraseña no coinciden' });
                res.status(200).json({ message: 'fail' });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const TokenValido = async (req, res) => {
    //console.log('entre a Token Valido')
    res.status(200).json({ message: 'Ok' });
}



export const validaToken = async (usuario, clave) => {

    try {
        const [rows] = await pool.query('SELECT * FROM tbl_user WHERE status = ? and usuario = ?', ['A', usuario])

        //console.log(rows)

        if (clave = rows[0].password) {
            //console.log('entre')
            return true;
        } else {
            //console.log('entre2')
            return false;
        }

    } catch (error) {
        //console.log('entre3')
        return false
    }
}


export const encrypt = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}



export const getUsuarios = async (req, res) => {
    //console.log(req.token)

    try {
        //throw new Error('Ere')
        const [rows] = await pool.query('SELECT a.cod_empresa, a.id, a.usuario, a.nombre, a.cod_role, b.role , a.password, a.status ' +
            'FROM jirehdb.tbl_user a, ' +
            '     jirehdb.tbl_role b ' +
            ' where	a.cod_role = b.cod_role');
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}

export const getUsuario = async (req, res) => {
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

export const createUsuario = async (req, res) => {
    console.log(req.body)
    const User = {
        cod_empresa: req.body.cod_empresa,
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        role: req.body.role,
        password: await encrypt(req.body.password)
    }

    // console.log(User)

    try {
        const [rows] = await pool.query('CALL PR_USER(?,?,?,?,?)', [User.cod_empresa, User.usuario, User.nombre, User.role, User.password])

        
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

export const updateUsuario = async (req, res) => {
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

export const deleteUsuario = async (req, res) => {
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