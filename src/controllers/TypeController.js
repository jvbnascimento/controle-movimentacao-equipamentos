const Type = require('../models/Type');

module.exports = {
	async index(req, res) {
		const types = await Type.findAll();

		return res.json({ types });
	},

	async store(req, res) {
		const { name } = req.body;

		const type = await Type.create({ name });

		return res.json({ type });
	},
}