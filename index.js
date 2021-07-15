const express =require('express');

//crear el servidor de express
const app = express();
const puerto = 3000;

//iniciar serve npm run start:dev

//Rutas
app.get('/',(req, res)=>{
res.json(
    {ok:true,
    msg: 'Hola Mundo'}
)
});


app.listen(puerto, ()=>{
    console.log('Servidor corriendo en puerto '+ puerto);

} );