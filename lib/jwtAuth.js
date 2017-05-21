'use strict';

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const customError = require('./customError');

function idiomaRequest(req) {
	let lang = req.headers.language;

	if (lang === '') {
		// Según https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language deduzco que
		// lo de la izquierda del guión (lenguaje expresado en 2 ó 3 caracteres) es el idioma. Ejemplo:
		// req.acceptsLanguages(): [ 'ca-ES', 'ca', 'en' ]
		const acceptLanguages = req.acceptsLanguages()[0];
		if (acceptLanguages.substr(0, acceptLanguages.indexOf('-')) === 'ca' ||
			acceptLanguages.substr(0, acceptLanguages.indexOf('-')) === 'es') {
			return 'es';
		} else {
			return 'en';
		}
	}

	return lang;
}

function registro(req, res) {
	// Se da de alta el usuario
	const usuario = new Usuario({
		nombre: req.body.nombre,
		email: req.body.email,
		clave: sha256(req.body.clave)
	});

	// Se guarda el usuario
	usuario.save()
		.then(() => {
			let idioma = idiomaRequest(req);

			res.json({ success: true, result: customError.literalError(idioma, 'USER_SAVED') + ' ' + req.body.email + '.' });
			return;
		})
		.catch(() => {
			let idioma = idiomaRequest(req);
			
			console.log('Error al guardar usuario ' + req.body.email + '.');
			res.json({ success: true, result: customError.literalError(idioma, 'ERROR_SAVING_USER') + ' ' + req.body.email + '.' });
			return;
		});
}

function autentica(req, res) {
	Usuario.find({ email: req.body.email, clave: sha256(req.body.clave) }).exec()
		.then((values) => {
			switch (values.length) {
				case 0:
					res.json({ success: true, result: customError.literalError(req.headers.language, 'EMAIL_AND_PASS_NOT_FOUND') + ' ' + req.body.email + '.' });
					break;
				case 1:
					// Se genera el token
					let token = jwt.sign({ email: req.body.email }, 'estaeslapseudoclaveprivada', { expiresIn: '24h' });
					res.json({ success: true, token: token });
					break;
				default:
					res.json({ success: true, result: customError.literalError(req.headers.language, 'MORE_THAN_ONE_USER') + ' ' + req.body.email + '.' });
					break;
			}
		})
		.catch(() => {
			res.json({ success: false, result: customError.literalError(req.headers.language, 'ERROR_AUTHENTICATING') + ' ' + req.body.email + '.' });
			return;
		});
}

module.exports = {
	idiomaRequest: idiomaRequest,
	registro: registro,
	autentica: autentica
};