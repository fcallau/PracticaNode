"use strict";

let mongoose = require('mongoose');
let Usuario = mongoose.model('Usuario');

const basicAuth = require('basic-auth');

module.exports = (req, res, next) => {
	const user = basicAuth(req);

	if (!user) {
		console.log('No hay usuario');
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		res.send(401);
		return;
	} else {
		console.log('Sí hay usuario, user.name:', user.name);
		Usuario.find({ nombre: user.name, clave: user.pass }).exec((err, list) => {
			if (err) {
				next(err);
				return;
			}

			if (list.length === 0) {
				console.log('Usuario no existente o no coincide password');
				let err = new Error('Aquí configuro error en basicAuth.js');
				next(err);
				/*res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
				res.send(401);
				return;*/
			} else {
				res.json({ success: true, list: list });
				return;
			}
		});
	}
};