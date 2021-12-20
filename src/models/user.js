//Definimos el esquema 
//Llamamos al modulo mongoose
const mongoose=require('mongoose');
//Llamamos al modulo bcrypt
const bcrypt=require('bcrypt-nodejs');
//Llamamos al Schema
const {Schema}=mongoose;
//Inicializamos el Schema
const userSchema=new Schema({
    email:String,
    password:String
});
//Definimos un metodo llamado encryptPassword para realizar el cifrado de las contraseñas
userSchema.methods.encryptPassword=(password)=>{
    //bcrypt.hashSync(password,numeroDeVecesQueSeRepiteElAlgoritmo)
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword= function(password){
    //bcrypt.compareSync(password,this.password); retorna un booleano
    return bcrypt.compareSync(password,this.password);
}

//Le pasamos el esquema mediante el metodo model, model va a validar si cumple con ese modelo
module.exports=mongoose.model('users',userSchema);
