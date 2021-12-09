//Llamamos a passport para una validacion local
const passport=require('passport');
//En passport las autenticaciones se denominan strategy
const localStrategy=require('passport-local').Strategy;
//Usamos una estrategia pasandole el tipo de datos
passport.use('local-signup',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{

}));