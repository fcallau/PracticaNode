'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const customError = require('../../lib/customError.js');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../../lib/jwtAuth');

router.get('/', (req, res, next) => {
	const tag = req.query.tag;
	const venta = req.query.venta;
	const nombre = req.query.nombre;
	const precio = req.query.precio;
	const skip = parseInt(req.query.start);
	const limit = parseInt(req.query.limit);
	const sort = req.query.sort;
	const includeTotal = req.query.includeTotal;
	const token = req.query.token;

	// Creo el filtro vacío
	const filter = {};

	if (tag) {
		filter.tags = { $in: [tag] };
	}

	if (venta) {
		filter.venta = venta;
	}

	if (nombre) {
		filter.nombre = new RegExp('^' + nombre, 'i');
	}

	if (precio) {
		if ((precio.length === precio.match(/[0-9]*-?[0-9]*/g)[0].length) && precio !== '-' && precio.length > 0) {
			const posGuion = precio.indexOf('-');

			if (posGuion >= 0) {
				// Si existe guión

				switch (posGuion) {
					// En primera posición (-N)
					case 0:
						filter.precio = { '$lte': precio.substr(1, precio.length - 1) };
						break;
					// En última posición (N-)
					case precio.length - 1:
						filter.precio = { '$gte': precio.substr(0, precio.length - 1) };
						break;
					// En los demás casos	(N-M)
					default:
						filter.precio = {
							'$gte': precio.substr(0, posGuion),
							'$lte': precio.substr(posGuion + 1, precio.length - 1)
						};
						break;
				}
			} else {
				// Si NO existe guión
				filter.precio = parseInt(precio);
			}
		} else {
			console.log('req: ', req);
			let err = new Error(customError.literalError(req.headers.language, 'FORMAT_PRICE_NOT_ACCEPTED'));
			next(err);
			return;
		}
	}

	if (token) {
		console.log('token informado');
		try {
			jwt.verify(token, 'estaeslapseudoclaveprivada');
		} catch (error) {
			res.json({ success: false, result: error.message });
			return;
		}
	} else {
		console.log('Para obtener anuncios tiene que estar autenticado.');
		let idioma = jwtAuth.idiomaRequest(req);
		// res.json({ success: false, result: req.body.email + ', ' + customError.literalError(idioma, 'HAVE_TO_BE_AUTHENTICATED') + '.' });
		res.json({ success: false, result: customError.literalError(idioma, 'HAVE_TO_BE_AUTHENTICATED') + '.' });
		return;
	}

	let promiseContarRegistros = Anuncio.contarRegistros(filter, includeTotal);
	let promiseListaRegistros = Anuncio.listaRegistros(filter, skip, limit, sort);

	Promise.all([promiseContarRegistros, promiseListaRegistros])
		.then((values) => {
			res.json({ success: true, info: { ocurrencias: values[0], list: values[1] } });
		})
		.catch((err) => {
			next(err);
		});
});

// Crear un anuncio vía GET (para testear el anuncioSchema)
/*router.get('/testSaveAnuncio', (req, res, err) => {
	let anuncio = new Anuncio({
		nombre: 'testAnuncio',
		venta: true,
		precio: 123.45,
		foto: 'fotoTest.jpg',
		tags: ['hola', 'que', 'tal']
	});

	anuncio.save((err, anuncioGuardado) => {
		if (err) {
			return next(err);
		}

		res.json({ success: true, anuncio: anuncioGuardado });
	});
});*/

// Crear un anuncio vía POST
/*router.post('/', (req, res, next) => {
	let anuncio = new Anuncio(req.body);

	anuncio.save((err, anuncioGuardado) => {
		if (err) {
			return next(err);
		}
		res.json({ success: true, anuncio: anuncioGuardado });
	});
});*/

module.exports = router;