'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3999;



mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://jean2003:jean2003@cluster0.ewvwgq3.mongodb.net/?retryWrites=true&w=majority' , { useNewUrlParser : true})

    .then( // si la conexion es correcta se conecta 
        () => {

            console.log('La Conexion a la bd es correcta... !!');

            // CREANDO UN SERVIDOR 
            app.listen(port, () =>{
                console.log('EL SERVIDOR http://localhost:'+port+' esta funcionando.');
                }
            ); 


        }
    )
    .catch( // si no es correcta lanzara error
        error => console.log(error) // ATRAPA CUALQUIER ERROR DE CONEXION 
    );