const Movement = require('../models/Movement');
const Hardware = require('../models/Hardware');
const User = require('../models/User');
const Department = require('../models/Department');
const { Op } = require('sequelize');
const { param } = require('../routes');

module.exports = {
	async listAllMovements(req, res) {
        const { limit, offset } = req.params

		const movements = await Movement.findAndCountAll({
			include: [
				{
					association: 'previous_department'
				},
				{
					association: 'next_department'
				}, 
				{
					association: 'responsible'
				},
				{
					association: 'hardwares',
					through: {
                        attributes: [],
                    },
                    include: {
                        association: 'category'
                    }
				}
            ],
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
		});

		return res.json(movements);
	},

	async listMovementById(req, res) {
		const { movement_id } = req.params;

		const movement = await Movement.findByPk(movement_id, {
			attributes: ['date_movement'],
			include: [
				{
					association: 'previous_department',
				},
				{
					association: 'next_department',
				}, 
				{
					association: 'responsible',
				},
				{
					association: 'hardwares',
					through: {
						attributes: [],
					},
                    include: {
                        association: 'category'
                    }
				}
			]
		});

		if (!movement) {
			return res.status(404).json({ error: 'Movement not found!' });
		}

		return res.json(movement);
	},

	async listAllMovementsByData(req, res) {
		const { date_movement } = req.params;

		const movements = await Movement.findAll({
			where: {
				date_movement
			},
			include: [
				{
					association: 'previous_department',
				},
				{
					association: 'next_department',
				}, 
				{
					association: 'responsible',
				},
				{
					association: 'hardwares',
					through: {
						attributes: [],
					},
                    include: {
                        association: 'category'
                    }
				}
			]
		});

		return res.json(movements);
    },
    
    async listAllMovementsByHeritage(req, res) {
        const { heritage } = req.params

		const movements = await Movement.findAll({
			include: [
				{
					association: 'previous_department'
				},
				{
					association: 'next_department'
				}, 
				{
					association: 'responsible'
				},
				{
                    association: 'hardwares',
                    where: { 
                        heritage: {
                            [Op.iLike]: `%${heritage}%`
                        }
                    },
					through: {
                        attributes: [],
                    },
                    include: {
                        association: 'category'
                    }
				}
            ],
            order: [
                ['id', 'DESC']
            ]
		});

		return res.json(movements);
    },
    
    async listAllMovementsByAdvancedSearch(req, res) {
        // const { parameters } = req.params

        // const transformParameters = JSON.parse(parameters);

		// const movements = await Movement.findAll({
		// 	include: [
		// 		{
		// 			association: 'previous_department'
		// 		},
		// 		{
		// 			association: 'next_department'
		// 		}, 
		// 		{
		// 			association: 'responsible'
		// 		},
		// 		{
        //             association: 'hardwares',
        //             where: { 
        //                 heritage: {
        //                     [Op.iLike]: `%${heritage}%`
        //                 }
        //             },
		// 			through: {
        //                 attributes: [],
        //             },
        //             include: {
        //                 association: 'category'
        //             }
		// 		}
        //     ],
        //     order: [
        //         ['id', 'DESC']
        //     ]
		// });

		return res.json({teste: "teste"});
	},

	async create(req, res) {
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
            hardware.department_id = destination_department_id;
            await hardware.save();

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
		await movement.addHardware(list_hardwares);

		return res.json(movement);
	},

	async update(req, res) {
		const { movement_id } = req.params;
		const {
			date_movement,
			origin_department_id,
			destination_department_id,
			responsible_id,
			hardwares,
		} = req.body;
		
		if (!await Movement.findByPk(movement_id)) {
			return res.status(404).json({ error: 'Movement not found!' });
		}
		if (!await Department.findByPk(origin_department_id)) {
			return res.status(404).json({ error: 'Origin department not found!' });
		}
		if (!await Department.findByPk(destination_department_id)) {
			return res.status(404).json({ error: 'Destination department not found!' });
		}
		if (!await User.findByPk(responsible_id)) {
			return res.status(404).json({ error: 'User not found!' });
		}
		if (hardwares.length == 0) {
			return res.status(400).json({ error: 'Hardware list cannot be empty!' });
		}

		await Movement.findByPk(movement_id, {
			include: {
				association: 'hardwares',
				attributes: []
			}
		}).then(async (movement) => {
			await movement.setHardwares([]);
		
			hardwares.forEach(async (element) => {
				const hardware = await Hardware.findByPk(element.id);

				if (hardware) {
					await movement.addHardware(hardware);
				}
			});

			movement.date_movement = date_movement;
			movement.origin_department_id = origin_department_id;
			movement.destination_department_id = destination_department_id;
			movement.responsible_id = responsible_id;

			await movement.save();

			return res.json(movement);
		});
	},

	async delete(req, res) {
		const { movement_id } = req.params;

		const movement = await Movement.findByPk(movement_id);
		
		if (!movement) {
			return res.status(404).json({ error: 'Movement not found!' });
		}

		await movement.destroy();

		return res.status(204).json();
	},
}