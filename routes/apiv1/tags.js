'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const utils = require('../../lib/utils');

router.get('/', (req, res) => {
	Anuncio.find({}).distinct('tags').exec()
		.then((tags) => {
			console.log('En el then de tags.js. anucios:', tags);
			res.json({ success: true, tags: { usedTags: tags.sort(), availableTags: utils.availableTags } });
		})
		.catch(() => {
			console.log('En el catch de tags.js');
			res.json({ success: false, tags: { usedTags: null, availableTags: utils.availableTags } });
		});
});

module.exports = router;