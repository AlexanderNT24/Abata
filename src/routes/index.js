//Llamamos a express
const express = require('express');
const req = require('express/lib/request');
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
    res.render('signin');
});
//Tomamos la informacion 
router.post('/signin',passport.authenticate('local-signin',{
    successRedirect:'/profile',
    failureRedirect:'/signin',
    passReqToCallback:true
}));
router.get('/logout',(req,res,next)=>{
    req.logOut();
    res.redirect('/');
})
//Validamos que no se pueda acceder a las rutas protegidas
router.use((req,res,next)=>{
    isAuthenticated(req,res,next);
    next();
});

router.get('/profile',(req,res,next)=>{
    res.render('profile');
})

//Funcion para validar si estas autenticado
function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};
//Para poder usarlo en otros archivos
module.exports=router;