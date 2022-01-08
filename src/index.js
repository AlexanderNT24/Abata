//Llamamos a express
const express = require('express');

//Llamamos al generador de plantillas ejs
const engine= require('ejs-mate');
//Llamamos al modulo path para usar rutas del sistema operativo
const path=require('path');
//Llamamos al modulo morgan
const morgan=require('morgan');
//Llamamos al modulo passport
const passport=require('passport');
//Llamamos express-session
const session=require('express-session');
//Llamamos a conect falsh
const flash=require('connect-flash');

//Asignamos a un objeto express()
const app=express();
app.use( express.static( "public" ) );
//Llamo al archivo de la base de datos
require('./database');
require('./passport/local-auth');

//Creamos un servidor http mediante express 
const http= require('http').Server(app);

//Para la comunicacion entre los html vamos a trabajar con socket.io
const io= require('socket.io')(http);

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
app.use(session({
    secret:'mysecretsession',
    resave:false,
    saveUninitializated:false

}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    //Declaramos una variable accesible desde toda la aplicación con app.locals
    app.locals.signUpMessage=req.flash('signUpMessage');
    app.locals.signInMessage=req.flash('signInMessage');
    app.locals.title="ABATA";
    //La autenticación nos devuelve un usuario
    app.locals.user=req.user;
    //Callback para seguir
    next();

})

//Rutas
app.use('/',require('./routes/index'));



//Iniciamos el servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en el Puerto',app.get('port'))
});