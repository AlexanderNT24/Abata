//Llamamos a express
const express = require('express');
//Creamos un objeto con las rutas del servidor
const router=express.Router();
//Llamamos a passport
const passport=require('passport');

//Tomamos la rutas desde el / pues dominio/.. luego de eso lo vamos a procesar con un request un response y un next que es un manejador de peticiones
//Principal
router.get('/',(req,res,next)=>{
    res.render('index');
});
//Registro
//Enviamos a una ventana
router.get('/signup',(req,res,next)=>{
    res.render('signup');
});
//Tomamos la informacion 
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    passReqToCallback:true
}));

//Enviamos a una ventana
router.get('/signin',(req,res,next)=>{

});
//Tomamos la informacion 
router.post('/signin',(req,res,next)=>{

});

router.get('/profile',(req,res,next)=>{
    res.render('profile');
})
//Para poder usarlo en otros archivos
module.exports=router;