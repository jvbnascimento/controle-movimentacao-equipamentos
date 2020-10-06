const { Op } = require("sequelize");

const Hardware = require('../models/Hardware');
const Type = require('../models/Type');
const Department = require("../models/Department");

module.exports = {
	async listAllDetailedHardwares(req, res) {
        const { limit, offset } = req.params;

        const filters = req.query;

        let hardwareFilters = {}
        let belongsFilters = {}
        let categoryFilters = {}

        if (filters.heritage) {
            hardwareFilters.heritage = {
                [Op.like]: `%${filters.heritage}%`
            }
        }
        if (filters.brand) {
            hardwareFilters.brand = {
                [Op.like]: `%${filters.brand.toUpperCase()}%`
            }
        }
        if (filters.warranty) {
            hardwareFilters.warranty = {
                [Op.like]: `%${filters.warranty.toUpperCase()}%`
            }
        }
        if (filters.has_office) {
            hardwareFilters.has_office = {
                [Op.like]: `%${filters.has_office.toUpperCase()}%`
            }
        }
        if (filters.auction) {
            hardwareFilters.auction = {
                [Op.eq]: `${filters.auction}`
            }
        }
        if (filters.category) {
            categoryFilters.name = {
                [Op.like]: `%${filters.category.toUpperCase()}%`
            }
        }
        if (filters.belongs) {
            belongsFilters.name = {
                [Op.like]: `${filters.belongs.toUpperCase()}`
            }
        }

		const hardwares = await Hardware.findAndCountAll({
            include: [
                {
                    association: 'category',
                    required: true,
                    where: categoryFilters,
                },
                {
                    association: 'belongs',
                    required: true,
                    where: belongsFilters,
                },
            ],
            where: hardwareFilters,
            order: [
                ['heritage']
            ],
            limit,
            offset,
            distinct: true,
        });

		return res.json(hardwares);
	},

	async listAllHardwares(req, res) {
		const hardwares = await Hardware.findAll({
			include: [
				{
					association: 'category',
				},
				{
					association: 'belongs',
				}
			],
		});

		return res.json(hardwares);
	},

	async listAllHardwaresByDescription(req, res) {
		const { description } = req.params;

		const hardwares = await Hardware.findAll({
			where: {
				description: {
					[Op.iLike]: `%${description}%`
				}
			},
			include: [
				{
					association: 'category',
				},
				{
					association: 'belongs',
				}
			],
		});

		return res.json(hardwares);
	},

	async listAllHardwaresByCategory(req, res) {
		const { name_category } = req.params;

		const hardwares = await Hardware.findAll({
			include: [
				{
					association: 'category',
					where: {
						name: {
							[Op.iLike]: name_category
						}
					}
				},
				{
					association: 'belongs',
				}
			],
		});

		return res.json(hardwares);
	},
	
	async listHardwareByHeritage(req, res) {
		const { heritage } = req.params;

		const hardware = await Hardware.findAll({
			where: {
				heritage: {
					[Op.iLike]: `%${heritage}%`
                }
			},
			include: [
				{
					association: 'category',
				},
				{
					association: 'belongs',
				}
			],
		});

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}

		return res.json(hardware);
    },

    async listHardwareByDepartment(req, res) {
		const { department_id } = req.params;

		const hardware = await Hardware.findAll({
			include: [
				{
					association: 'category',
				},
				{
                    association: 'belongs',
                    where: {
                        id: parseInt(department_id)
                    },
                },
			],
			order: [
				['heritage']
			],
		});

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}

		return res.json(hardware);
    },

    async listHardwareByDepartmentName(req, res) {
        const { department_name, limit, offset } = req.params;

		const hardwares = await Hardware.findAndCountAll({
			include: [
				{
                    association: 'category',
				},
				{
                    association: 'belongs',
                    where: {
                        name: department_name.replace("-", "/")
                    },
                },
			],
			order: [
				['heritage']
			],
			limit,
			offset,
			distinct: true,
			subQuery: false
        });

		if (!hardwares) {
			return res.status(404).json({ error: 'Hardwares not found' });
		}

        return res.json(hardwares);
    },
    
	async listHardwareById(req, res) {
		const { hardware_id } = req.params;

		const hardware = await Hardware.findByPk(hardware_id, {
			include: [
				{
					association: 'category',
				},
				{
					association: 'belongs',
				}
			],
		});

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}

		return res.json(hardware);
    },

	async create(req, res) {
		const { type_id } = req.params;
		const {
			heritage,
			description,
			brand,
			warranty,
			has_office,
			auction,
			date_auction,
			department_id
		} = req.body;

		const type = await Type.findByPk(type_id);
		const department = await Department.findByPk(department_id);

		if (!type) {
			return res.status(404).json({ error: 'Type not found' });
		}
		if (!department) {
			return res.status(404).json({ error: 'Department not found' });
		}

		const hardware = await Hardware.create({
			heritage,
			description,
			brand,
			warranty,
			has_office,
			auction,
			date_auction,
			department_id,
			type_id
		});

		return res.json(hardware);
	},

	async update(req, res) {
		const { hardware_id } = req.params;
		const {
			heritage,
			description,
			brand,
			warranty,
			has_office,
			auction,
			date_auction,
			department_id,
			type_id
		} = req.body;

		const hardware = await Hardware.findByPk(hardware_id, {
			include: [
				{
					association: 'category',
				},
				{
					association: 'belongs',
				}
			],
		});
		const type = await Type.findByPk(type_id);
		const department = await Department.findByPk(department_id);

		if (!hardware) {
			return res.status(404).json({ error: 'Hardware not found' });
		}
		if (!type) {
			return res.status(404).json({ error: 'Type not found' });
		}
		if (!department) {
			return res.status(404).json({ error: 'Department not found' });
		}

		hardware.heritage = heritage;
		hardware.description = description;
		hardware.brand = brand;
		hardware.warranty = warranty;
		hardware.has_office = has_office;
		hardware.auction = auction;
		hardware.date_auction = date_auction;
		hardware.department_id = department_id;
		hardware.type_id = type_id;

		await hardware.save();

		return res.json(hardware);
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