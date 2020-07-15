const Hardware = require('../models/Hardware');
const Type = require('../models/Type');

module.exports = {
	async index(req, res) {
		const hardwares = await Hardware.findAll({
			attributes: ['id_hardware', 'description'],
			include: {association: 'category'},
		});

		return res.json({ hardwares });
	},

	// async index(req, res) {
	// 	const hardwares = await Hardware.findAll({
	// 		attributes: ['id_hardware', 'description'],
	// 		include: {association: 'category'},
	// 	});

	// 	return res.json({ hardwares });
	// },

	async store(req, res) {
		const { type_id } = req.params;
		const { id_hardware, description } = req.body;

		const type = await Type.findByPk(type_id);

		if (!type) {
			return res.status(400).json({ error: 'Type not found' });
		}

		const hardware = await Hardware.create({
			id_hardware,
			description,
			type_id
		});

		return res.json({ hardware });
	},
}