
const { validationResult } = require('express-validator');
const {response} =require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');

const getUsuarios = async(req, res)=>{

    const usuario=await Usuario.find({},'nombre role google email');


res.json(
    {ok:true,
        usuario    
    });

}

const crearUsuario = async(req, res = response)=>{

const {email, password, nombre} = req.body;

try {
    
    const existeEmail = await Usuario.findOne({email});
    
    if(existeEmail){
        return res.status(400).json({
            ok:false,
            msg:'El Correo ya está registrado'
        });
    }
    
    
    const usuario = new Usuario(req.body);

//Encriptar contraseña
const salt  = bcrypt.genSaltSync();
usuario.password =bcrypt.hashSync(password,salt);

//guardar Usuario
    await usuario.save();

    res.json(
    {ok:true,
      usuario
    });


} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:'Error inesperado , revise logs'
    });
}




}


    module.exports = {
        getUsuarios,
        crearUsuario
    }