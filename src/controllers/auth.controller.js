import jwt from 'jsonwebtoken'
import { SECRET } from '../config.js'
import { validaToken } from '../controllers/user.controller.js'
//Authorization: Bearer <token>
export const verifyToken = async(req, res, next) => {
    //console.log('entre el verifytoken')
    const bearerHeader = req.headers['authorization']

    //    console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
        const bearToken = bearerHeader.split(" ")[1];
        //req.token = bearToken;
        //console.log(bearToken)
        jwt.verify(bearToken, SECRET, async(err, auth) => {
            if (err) {
                //console.log(err)
                res.status(403).json({
                    message: 'token invalido'
                })
            } else {
                //console.log(auth)
                if (await validaToken(auth.usuario, auth.clave)) {
                    next();
                } else {
                    res.status(403).json({
                        message: 'token invalido 2'
                    })
                }

            }
        })
    } else {
        //res.sendStatus(403)
        res.status(403).json({
            message: 'authorization token invalido'
        })
    }

}