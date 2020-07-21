const { Op } = require("sequelize");

const Hardware = require('../models/Hardware');
const Type = require('../models/Type');

module.exports = {
	async listAllDetailedHardwares(req, res) {
		const hardwares = await Hardware.findAll({
			include: {
				association: 'category',
				attributes: ['name']
			},
		});

		return res.json({ hardwares });
	},

	async listAllHardwares(req, res) {
		const hardwares = await Hardware.findAll({
			attributes: ['id_hardware', 'description'],
			include: {
				association: 'category',
				attributes: ['name']
			},
		});

		return res.json({ hardwares });
	},

	async listAllHardwaresByName(req, res) {
		const { description } = req.params;

		const hardwares = await Hardware.findAll({
			where: {
				description: {
					[Op.iLike]: `%${description}%`
				}
			},
			attributes: ['id_hardware', 'description'],
			include: {
				association: 'category',
				attributes: ['name']
			},
		});

		return res.json({ hardwares });
	},

	async listAllHardwaresByCategory(req, res) {
		const { name_category } = req.params;

		const hardwares = await Hardware.findAll({
			attributes: ['id_hardware', 'description'],
			include: {
				association: 'category',
				attributes: ['name'],
				where: {
					name: {
						[Op.iLike]: name_category
					}
				}
			},
		});

		return res.json({ hardwares });
	},
	
	async listHardware(req, res) {
		const { hardware_id } = req.params;

		const hardware = await Hardware.findByPk(hardware_id, {
			include: {
				association: 'category',
				attributes: ['name']
			},
		});

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}

		return res.json({ hardware });
	},

	async create(req, res) {
		const { type_id } = req.params;
		const { id_hardware, description } = req.body;

		const type = await Type.findByPk(type_id);

		if (!type) {
			return res.status(404).json({ error: 'Type not found' });
		}

		const hardware = await Hardware.create({
			id_hardware,
			description,
			type_id
		});

		return res.json({ hardware });
	},

	async update(req, res) {
		const { hardware_id } = req.params;
		const { id_hardware, description, type_id } = req.body;

		const hardware = await Hardware.findByPk(hardware_id);
		const type = await Type.findByPk(type_id);

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}
		if (!type) {
			return res.status(404).json({ error: 'Type not found' });
		}

		hardware.id_hardware = id_hardware;
		hardware.description = description;
		hardware.type_id = type_id;

		await hardware.save();

		return res.json({ hardware });
	},

	async delete(req, res) {
		const { hardware_id } = req.params;

		const hardware = await Hardware.findByPk(hardware_id);

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}

		await hardware.destroy();

		return res.status(204).json();
	},
}