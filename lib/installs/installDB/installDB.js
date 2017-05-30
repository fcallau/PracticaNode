'use strict';

require('../../connectMongoose');
require('../../../models/Anuncio');
require('../../../models/Usuario');

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Usuario = mongoose.model('Usuario');
const anunciosJSON = require('./anuncios.json');
let usuariosJSON = require('./usuarios.json');
const sha256 = require('sha256');
const utils = require('../../utils');

const conn = mongoose.connection;

function hashPass(objJSON) {
	for (let index = 0; index < objJSON.length; index++) {
		objJSON[index].clave = sha256(objJSON[index].clave);
	}
}

async function main() {
	// Borrado de BBDD
	await conn.dropDatabase();
	console.log('BBDD borrada.');

	// Para cada una de las imágenes de anuncios se concatena la ruta para llegar hasta ella
	utils.concatenarRutaImagen('images/anuncios/', anunciosJSON.anuncios);

	// Guardado de los anuncios
	await Anuncio.insertMany(anunciosJSON.anuncios);
	console.log('Anuncios guardados.');

	// Se guardan las claves "hasheadas""
	hashPass(usuariosJSON.usuarios);

	// Guardado de los usuarios
	await Usuario.insertMany(usuariosJSON.usuarios);
	console.log('Usuarios guardados.');

	// Desconexión de MongoDB
	await conn.close();
	console.log('Desconectado de MongoDB.');
}

main().then((result) => {
	console.log('Datos guardados. Puede empezar a trabajar.');
}).catch((err) => {
	console.log('Se produjo un error:', err);
	process.exit(1);
});