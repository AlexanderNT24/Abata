//Llamamos al modulo mongoose
const mongoose=require('mongoose');
//Llamamos al obj mongodb de nuestro documento ./keys
const {mongodb}=require('./keys');
//Realizamos la conexion a la base de datos .then para la conexion y . catch para los errores
mongoose.connect(mongodb.URI,{})
.then(db=>console.log('Conectado'))
.catch(err=>console.error(err));
