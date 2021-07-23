
const { validationResult } = require('express-validator');
const {response} =require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');


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

    //generar JWT
    const token =await generarJWT(usuario.id);

    res.json(
    {ok:true,
      usuario,
      token
    });


} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:'Error inesperado , revise logs'
    });
}
}



const actualizarUsuario= async(req, res = response)=>{

    const uid = req.params.id;
    

    try {

        const usuarioDB = await Usuario.findById(uid);
        

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }

             //actualizar
             const {password,google ,email , ...campos} = req.body;

        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){ 
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }

        }

        campos.email=email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true, useFindAndModify:false});
        
        res.json({
            ok:true,
            usuario:usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }

}

const borrarUsuario = async(req, res = response ) =>{
        
    const uid =req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);
        

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

            res.json({
                ok:true,
               msg:'Usuario Eliminado'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Error inesperado'
            });
        }
}


    module.exports = {
        getUsuarios,
        crearUsuario,
        actualizarUsuario,
        borrarUsuario
    }