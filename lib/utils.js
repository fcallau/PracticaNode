'use strict';

/*const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');*/

const availableTags = ['work', 'lifestyle', 'motor', 'mobile'].sort();

function concatenarRutaImagen(ruta, objJSON) {
	for (let index = 0; index < objJSON.length; index++) {
		objJSON[index].foto = ruta.concat((objJSON[index].foto));
	}
}

module.exports = {
	availableTags: availableTags,
	concatenarRutaImagen: concatenarRutaImagen
};