//Llamamos a express
const express = require('express');
//Llamamos al generador de plantillas ejs
const engine= require('ejs-mate');
//Llamamos al modulo path para usar rutas del sistema operativo
const path=require('path');
//Llamamos al modulo morgan
const morgan=require('morgan');

//Asignamos a un objeto express()
const app=express();
//Llamo al archivo de la base de datos
require('./database');

//Configuraciones
//Como node puede tener compliaciones al encontrar la ruta donde se va a iniciar el proyecto, uso el modulo path para asignarlo y hacelo multiplataforma
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',engine);
//Asignamos el motor de plantillas
app.set('view engine', 'ejs');
//Para asignar el puerto
app.set('port',process.env.PORT || 3000);

//Llamamos a los middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));


//Rutas
app.use('/',require('./routes/index'));

//Iniciamos el servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en el Puerto',app.get('port'))
});