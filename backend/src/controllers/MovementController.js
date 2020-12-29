const Movement = require('../models/Movement');
const Hardware = require('../models/Hardware');
const User = require('../models/User');
const Department = require('../models/Department');
const { Op } = require('sequelize');
const Type = require('../models/Type');

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
                    include: [
                        {
                            association: 'category'
                        },
                        {
                            association: 'belongs'
                        }
                    ],
                }
            ],
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
			distinct: true,
			subQuery: false
        });

        return res.json(movements);
    },

    async listMovementById(req, res) {
        const { movement_id } = req.params;

        const movement = await Movement.findByPk(movement_id, {
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
                    include: [
                        {
                            association: 'category'
                        },
                        {
                            association: 'belongs'
                        }
                    ],
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
                    include: [
                        {
                            association: 'category'
                        },
                        {
                            association: 'belongs'
                        }
                    ],
                }
            ]
        });

        return res.json(movements);
    },

    async listAllMovementsByHeritage(req, res) {
        const { code } = req.params

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
                        code: {
                            [Op.iLike]: `%${code}%`
                        }
                    },
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            association: 'category'
                        },
                        {
                            association: 'belongs'
                        }
                    ],
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        });

        return res.json(movements);
    },

    async listAllMovementsByAdvancedSearch(req, res) {
        try {
            const { limit, offset } = req.params

            const filters = req.query;

            let movementFilters = {}
            let hardwareFilters = {}
            let belongsFilters = {}
            let categoryFilters = {}

            if (filters.code) {
                hardwareFilters.code = {
                    [Op.like]: `%${filters.code}%`
                }
            }
            if (filters.brand) {
                hardwareFilters.brand = {
                    [Op.like]: `%${filters.brand}%`
                }
            }
            if (filters.warranty) {
                hardwareFilters.warranty = {
                    [Op.like]: `%${filters.warranty}%`
                }
            }
            if (filters.has_office) {
                hardwareFilters.has_office = {
                    [Op.like]: `%${filters.has_office}%`
                }
            }
            if (filters.auction) {
                hardwareFilters.auction = {
                    [Op.eq]: `${filters.auction}`
                }
            }
            if (filters.category) {
                categoryFilters.name = {
                    [Op.like]: `%${filters.category}%`
                }
            }
            if (filters.belongs) {
                belongsFilters.name = {
                    [Op.like]: `%${filters.belongs.toUpperCase()}%`
                }
            }
            // if (filters.date_movement) {
            //     movementFilters.date_movement = {
            //         [Op.like]: `%${filters.date_movement}%`
            //     }
            // }

            const movements = await Movement.findAndCountAll({
                include: [
                    {
                        model: Department,
						as: "previous_department",
						required: false,
                    },
                    {
                        model: Department,
						as: "next_department",
						required: false,
                    },
                    {
                        model: User,
						as: "responsible",
						required: false,
                    },
                    {
                        model: Hardware,
                        as: "hardwares",
                        required: true,
						where: hardwareFilters,
                        through: {
                            attributes: []
                        },
                        include: [
                            {
                                model: Type,
                                as: "category",
                                required: false,
								where: categoryFilters,
                            },
                            {
                                model: Department,
                                as: "belongs",
                                required: true,
								where: belongsFilters,
                            },
                        ]
                    }
				],
				where: movementFilters,
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset: (offset - 1) * limit,
				distinct: true,
				subQuery: false,
            });

            return res.json({ movements });
        }
        catch (e) {
            return res.json({ error: "Não foi possível realizar a execução da Query" });
        }

    },

    async create(req, res) {
        const {
            date_movement,
            origin_department_id,
            destination_department_id,
            responsible_id,
            hardwares,
		} = req.body;

        const movement = Movement.create({
            date_movement,
            origin_department_id,
            destination_department_id,
            responsible_id
        }).then(async (movement) => {
			hardwares.map(async (element) => {
				const hardware = await Hardware.findByPk(element.id);

				if (hardware) {
					hardware.department_id = destination_department_id;
					await hardware.save();
					await movement.addHardware(hardware);
				}
			});
		}).catch((err) => {
			return err;
		});

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
        if (hardwares.length === 0) {
            return res.status(400).json({ error: 'Hardware list cannot be empty!' });
        }

        await Movement.findByPk(movement_id, {
            include: {
                association: 'hardwares',
            }
        }).then(async (movement) => {
            movement.hardwares.map(async (element) => {
                const hardware = await Hardware.findByPk(element.id);

                if (hardware) {
                    hardware.department_id = origin_department_id;
                    await hardware.save();
                }
            });

            await movement.setHardwares([]);

            hardwares.map(async (element) => {
                const hardware = await Hardware.findByPk(element.id);

                if (hardware) {
					hardware.department_id = destination_department_id;
					await hardware.save();
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