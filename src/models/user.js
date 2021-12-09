//Definimos el esquema 
//Llamamos al modulo mongoose
const mongoose=require('mongoose');
//Llamamos al Schema
const {Schema}=mongoose;
//Inicializamos el Schema
const userSchema=new Schema({
    email:String,
    password:String
});

//Le pasamos el esquema mediante el metodo model, model va a validar si cumple con ese modelo
module.exports=mongoose.model('users',userSchema);
