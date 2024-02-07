import { pool } from '../db.js'
// Importa la librería moment
import moment from 'moment';



export const getTareas = async (req, res) => {
    console.log(req.params)
    //  console.log(req.query)

    try {
        const [tareasResult] = await pool.query('SELECT id_usuario, id_tarea, title, descripcion, fecha FROM jirehdb.tbl_tarea where ID_USUARIO = ? and fecha = ?', [req.params.id_usuario,req.params.fecha]);

        const tareas = tareasResult.map((tarea) => ({
            id_usuario: tarea.id_usuario,
            id_tarea: tarea.id_tarea,
            title: tarea.title,
            descripcion: tarea.descripcion,
            fecha: tarea.fecha,
            items: []  // Inicialmente vacío; se llenará más adelante
        }));

        // Recorrer las tareas y obtener los detalles de cada tarea
        await Promise.all(tareas.map(async (element) => {
            const [detResult] = await pool.query('SELECT id_usuario,item, name, completed FROM jirehdb.tbl_det_tarea where id_usuario = ? and id_tarea = ? ', [req.params.id_usuario, element.id_tarea]);

            const det_tareas = detResult.map((det_tarea) => ({
                id_usuario: det_tarea.id_usuario,
                item: det_tarea.item,
                name: det_tarea.name,
                completed: det_tarea.completed
            }));

            // Asignar los detalles al campo 'items' de la tarea actual
            element.items = det_tareas;
        }));

        res.json(tareas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const getTarea = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_usuario, id_tarea, title, descripcion, fecha FROM jirehdb.tbl_tarea where ID_USUARIO = ? and id_tarea = ?', [req.params.id_usuario, req.params.id_tarea]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'No existen tareas para este usuario'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const getResumen = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT TITLE titulo,descripcion, CAST(SUM(IF(COMPLETED=TRUE, 1, 0)) AS SIGNED)completada,COUNT(1)total FROM TBL_TAREA TT, TBL_DET_TAREA TDT  WHERE TT.ID_USUARIO  = TDT.ID_USUARIO AND TT.ID_TAREA = TDT.ID_TAREA AND TT.ID_USUARIO = ? GROUP BY TITLE,DESCRIPCION', [req.params.id_usuario]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'No existen tareas para este usuario'
        })
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor'
        })
    }
}

export const createTarea = async (req, res) => {
    //console.log(req.body)
    const dataTarea = req.body;

    if (Array.isArray(dataTarea.fecha)) {

        //await dataTarea.fecha.forEach(async fec => {
        for (const fec of dataTarea.fecha) {
            try {
                console.log(dataTarea.id_usuario)
                console.log(dataTarea.id_tarea)
                console.log(dataTarea.title)
                console.log(dataTarea.descripcion)
                console.log(fec)
                const [rows] = await pool.query('CALL PR_TAREA(?,?,?,?,?)', [dataTarea.id_usuario, dataTarea.id_tarea, dataTarea.title, dataTarea.descripcion, fec])
                console.log(rows[0][0].p_id_tarea)

                try {
                    //await dataTarea.items.forEach(async element => {
                    for (const element of dataTarea.items) {
                        console.log(element.id_usuario, rows[0][0].p_id_tarea, element.name, element.completed)
                        const [rows1] = await pool.query('CALL PR_DET_TAREA(?,?,?,?,?)', [element.id_usuario, rows[0][0].p_id_tarea, element.item, element.name, element.completed])

                    };
                } catch (error) {
                    //   console.log(error)
                    return res.status(500).json({
                        message: 'error en el Servidor ' + error
                    })
                }
                //res.send({ message: 'Ok' })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'error en el Servidor ' + error
                })
            }
        }
        res.send({ message: 'Ok' })
    } else {
        console.log(dataTarea.id_usuario)
        console.log(dataTarea.title)
        console.log(dataTarea.descripcion)
        const fechaMySQL = moment(dataTarea.fecha).format('YYYY-MM-DD');
        console.log(fechaMySQL)
        try {
            const [rows] = await pool.query('CALL PR_TAREA(?,?,?,?,?)', [dataTarea.id_usuario, dataTarea.id_tarea, dataTarea.title, dataTarea.descripcion, fechaMySQL])
            // console.log(rows[0][0].p_id_tarea)
            try {
                //dataTarea.items.forEach(async element => {
                for (const element of dataTarea.items) {
                    console.log(element.id_usuario, rows[0][0].p_id_tarea, element.name, element.completed)
                    const [rows1] = await pool.query('CALL PR_DET_TAREA(?,?,?,?,?)', [element.id_usuario, rows[0][0].p_id_tarea, element.item, element.name, element.completed])
                    //console.log(rows1)
                };
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'error en el Servidor ' + error
                })
            }
            res.send({ message: 'Ok' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'error en el Servidor ' + error
            })
        }
    }

    //res.send({ message: 'Ok' })
}

export const updateTarea = async (req, res) => {
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

export const deleteTarea = async (req, res) => {
    //console.log("Llegue " + JSON.stringify(req.body))
    const { id_usuario, id_tarea } = req.body;
    try {
        const [result] = await pool.query('DELETE FROM tbl_det_tarea WHERE id_usuario = ? and id_tarea = ?', [id_usuario, id_tarea]);
               //   console.log('det_tarea '+result.affectedRows)
        try {
            const [result1] = await pool.query('DELETE FROM tbl_tarea WHERE id_usuario = ? and id_tarea = ?', [id_usuario, id_tarea]);
            //console.log('tarea '+result1.affectedRows)
        } catch (error) {
            return res.status(500).json({
                message: 'error en el Servidor: ' + error
            })
        }

        //          console.log([result1])

        /*if (result.affectedRows <= 0) return
        res.status(404).json({
            message: 'Bodega no Existe'
        })
        if (result.affectedRows != 1) {
            return res.status(404).json({
                message: 'Servidor: Error al Eliminar Registro'
            })
        }*/
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'error en el Servidor: ' + error
        })
    }
}