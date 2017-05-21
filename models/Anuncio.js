"use strict";

let mongoose = require('mongoose');

let anuncioSchema = mongoose.Schema({
	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
	tags: [String]
});

anuncioSchema.index({nombre: 1});
anuncioSchema.index({nombre: -1});
anuncioSchema.index({venta: 1});
anuncioSchema.index({venta: -1});
anuncioSchema.index({precio: 1});
anuncioSchema.index({precio: -1});
anuncioSchema.index({tags: 1});
anuncioSchema.index({tags: -1});

// De los registros que pasan el filtro, devuelve "limit" registros ignorando los "skip" registros
// primeros, ordenados por el campo "sort"
anuncioSchema.statics.listaRegistros = function(filter, skip, limit, sort) {
	return new Promise((resolve, reject) => {
		Anuncio.find(filter).skip(skip).limit(limit).sort(sort).exec()
			.then((anuncios) => {
				resolve(anuncios);
			})
			.catch((reason) => {
				reject(reason);
			});
	});
}

// Devuelve el número total de registros que pasan el filtro
anuncioSchema.statics.contarRegistros = function(filter, includeTotal) {
	return new Promise((resolve, reject) => {
		if (includeTotal === 'true') {
			Anuncio.find(filter).count().exec()
				.then((number) => {
					resolve(number);
				})
				.catch((reason) => {
					reject(reason);
				});
		} else {
			resolve(null);
		}
	});
}

let Anuncio = mongoose.model('Anuncio', anuncioSchema);