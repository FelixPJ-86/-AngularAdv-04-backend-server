require('dotenv').config();
const express =require('express');
const cors =require('cors');
const {dbConnection}=require('./database/config');


//crear el servidor de express
const app = express();

//configurar CORS
app.use(cors());


//Lectura y parseo del body
app.use(express.json());


//Base de datos
dbConnection();


//iniciar serve npm run start:dev


//Rutas
app.use('/api/usuarios', require('./routes/usuarios') );




app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto '+ process.env.PORT);

} );