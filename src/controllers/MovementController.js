const Movement = require('../models/Movement');
const Hardware = require('../models/Hardware');

module.exports = {
	async index(req, res) {
		const movements = await Movement.findAll({
			attributes: ['date_movement'],
			include: [
				{
					association: 'previous_department',
					attributes: ['name', 'boss']
				},
				{
					association: 'next_department',
					attributes: ['name', 'boss']
				}, 
				{
					association: 'responsible',
					attributes: ['name']
				},
				{
					association: 'hardwares',
					attributes: ['description'],
					through: {
						attributes: [],
					},
				}
			]
		});

		return res.json({ movements });
	},

	async store(req, res) {
		const {
			date_movement,
			origin_department_id,
			destination_department_id,
			responsible_id,
			hardwares,
		} = req.body;

		const list_hardwares = [];
		
		hardwares.forEach(async (element) => {
			const hardware = await Hardware.findByPk(element.id);

			if (hardware) {
				list_hardwares.push(hardware);
			}
		});

		const movement = await Movement.create({
			date_movement,
			origin_department_id,
			destination_department_id,
			responsible_id
		});
		movement.addHardware(list_hardwares);

		return res.json({ movement });
	},
}