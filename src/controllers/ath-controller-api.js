const {miConexion} = require('../database/db')
const bcrypt = require('bcrypt');

const authAPI = {};

authAPI.login = async ( req, res, next)  => {
    try {
        const {usuario, clave} = req.body;
        if(usuario == undefined || clave == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: 'Faltan paramentros: usuario y/o clave'
            })
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('SELECT * FROM usuarios WHERE usuario = ?',[usuario]);
            if (resultado.length > 0) {
                //si lo encontró
                //la clave está encripotada
                if (await bcrypt.compare(clave, resultado[0].clave)) {
                    //crear las variable se sesion
                    req.session.usuario = usuario;
                    req.session.id = resultado[0].id;
                    res.status(201).json({
                        estado: 1,
                        mensaje: 'Accesos correcto'
                    })
                } else {
                    res.status(404).json({
                        estado: 0,
                        mensaje: 'Usuario y/o clave incorrecta'
                    })
                }
            } else {
                
            }
            res.json(resultado[0]);
        }
    } catch (error) {
        
    }
}

authAPI.logout = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}
module.exports = authAPI;