'use strict';

const errorsJSON = require('./errors.json');
// let errorObj;

function literalError(idioma, clave) {
	let errorsArray = [];

	errorsArray = errorsJSON.errors;

	for (let index = 0; index < errorsArray.length; index++) {
		let element = errorsArray[index];

		if (element.clave === clave) {
			if (idioma == 'es') {
				return element.es;
			} else {
				return element.en;
			}
		}
	}
}

module.exports = {
	literalError: literalError
};
