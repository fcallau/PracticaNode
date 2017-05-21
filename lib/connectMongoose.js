'use strict';

let mongoose = require('mongoose');

let db = mongoose.connection;

// Le decimos a mongoose la librería de promesas vamos a usar
mongoose.Promise = global.Promise;

db.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

db.once('open', () => {
	console.log('Conectado a MongoDB.');
});

mongoose.connect('mongodb://localhost/CursoMEAN');