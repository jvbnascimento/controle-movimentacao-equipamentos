const Department = require('../models/Department');

module.exports = {
	async index(req, res) {
		const departments = await Department.findAll();

		return res.json({ departments });
	},

	async store(req, res) {
		const { name, boss } = req.body;

		const department = await Department.create({ name, boss });

		return res.json({ department });
	},
}