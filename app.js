'use strict' //

// REQUIRES 
var express = require('express');
var bodyParser = require('body-parser');


// CARGAR ARCHIVO DE RUTAS
var ventas_routes = require('./routes/ventas');
var categoria_routes = require('./routes/categoria');


// EJECUTAR EXPRESS
var app = express();


// AGREGAR LOS MIDDLEWARES
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// CONFIGURAR CABECERAS Y CORS
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');// PERMISO CONSUMIR DE CUALQUIER FRONT 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// REESCRIBIR RUTAS
app.use("/api", ventas_routes);
app.use("/api", categoria_routes);

// EXPORTAR MODULO 
module.exports = app;