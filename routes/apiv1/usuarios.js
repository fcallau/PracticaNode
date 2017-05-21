'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Isemail = require('isemail');
const jwtAuth = require('../../lib/jwtAuth');
const customError = require('../../lib/customError.js');

function parametrosCorrectos(req) {
	if (req.body.nombre.length > 1 && Isemail.validate(req.body.email) && req.body.clave.length > 3) {
		return { success: true, result: null };
	} else {
		console.log('2');
		const idioma = jwtAuth.idiomaRequest(req);
		return { success: false, result: customError.literalError(idioma, 'INCORRECT_FORMAT_PARAMETERS') };
	}
}

// Consulta de todos los usuarios
/*router.get('/', (req, res, next) => {
	Usuario.find().exec((err, list) => {
		if (err) {
			next(err);
			return;
		}

		res.json({ success: true, list: list });
		return;
	});
});*/

router.post('/register', (req, res, next) => {
	let paramOk = parametrosCorrectos(req);

	if (paramOk.success) {
		console.log('Busco si existe');
		Usuario.find({ email: req.body.email }).exec((err, list) => {
			if (err) {
				next(err);
				return;
			} else {
				// Ya existe email
				if (list.length > 0) {
					const idioma = jwtAuth.idiomaRequest(req);
					res.json({ success: false, result: customError.literalError(idioma, 'EXIST_USER')});
					return;
				} else {
					jwtAuth.registro(req, res);
				}
			}
		});
	} else {
		// Parámetros usuario erróneos
		res.json({ succes: false, result: paramOk.result });
		return;
	}
});

router.post('/authenticate', (req, res) => {
	let paramOk = parametrosCorrectos(req);

	if (paramOk.success) {
		jwtAuth.autentica(req, res);
		if (res.json.success) {
			console.log('res.json.token:', res.json.token);
			return;
		} else {
			return;
		}
	} else {
		// Parámetros usuario erróneos
		res.json({ succes: false, result: paramOk.result });
		return;
	}
});

module.exports = router;