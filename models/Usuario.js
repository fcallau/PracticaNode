"use strict";

let mongoose = require('mongoose');

let usuarioSchema = mongoose.Schema({
	nombre: String,
	email: String,
	clave: String
});

usuarioSchema.index({email: 1});

mongoose.model('Usuario', usuarioSchema);