const { Op } = require("sequelize");

const Hardware = require('../models/Hardware');
const Type = require('../models/Type');
const Department = require("../models/Department");

module.exports = {
    async listAllDetailedHardwares(req, res) {
        try {
            const { limit, offset } = req.params;

            const filters = req.query;

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
            if (filters.category) {
                categoryFilters.name = {
                    [Op.like]: `%${filters.category.toUpperCase()}%`
                }
            }
            if (filters.belongs) {
                belongsFilters.name = {
                    [Op.like]: `%${filters.belongs.toUpperCase()}%`
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
                    ['code']
                ],
                limit,
                offset: (offset - 1) * limit,
                distinct: true,
                subQuery: false
            });

            return res.status(200).json({ hardwares });
        }
        catch (e) {
            return res.status(400).json({ error: "Não foi possível realizar a execução da Query" });
        }
    },

    async listAllHardwares(req, res) {
        const hardwares = await Hardware.findAll({
            include: [
                { association: 'category' },
                { association: 'belongs' }
            ],
        });

        return res.status(200).json({ hardwares });
    },

    async listAllHardwaresByDescription(req, res) {
        const { description } = req.params;

        const hardwares = await Hardware.findAll({
            where: {
                description: { [Op.iLike]: `%${description}%` }
            },
            include: [
                { association: 'category' },
                { association: 'belongs' }
            ],
        });

        return res.status(200).json({ hardwares });
    },

    async listAllHardwaresByCategory(req, res) {
        const { name_category, limit, offset } = req.params;

        const hardwares = await Hardware.findAndCountAll({
            include: [
                {
                    association: 'category',
                    where: {
                        name: { [Op.iLike]: `%${name_category.toUpperCase()}%` }
                    }
                },
                { association: 'belongs' }
            ],
            order: [
                ['code']
            ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByCode(req, res) {
        const { code } = req.params;

        const hardware = await Hardware.findAll({
            where: {
                code: {
                    [Op.iLike]: `%${code}%`
                }
            },
            include: [
                { association: 'category' },
                { association: 'belongs' }
            ],
        });

        if (!hardware) {
            return res.status(404).json({ error: 'Hardware not found' });
        }

        return res.status(200).json({ hardware });
    },

    async listHardwareByDepartment(req, res) {
        const { department_id } = req.params;

        const hardware = await Hardware.findAll({
            include: [
                { association: 'category' },
                {
                    association: 'belongs',
                    where: { id: parseInt(department_id) },
                },
            ],
            order: [
                ['code']
            ],
        });

        if (!hardware) {
            return res.status(404).json({ error: 'Hardware not found' });
        }

        return res.status(200).json({ hardware });
    },

    async listHardwareByDepartmentName(req, res) {
        const { department_name, limit, offset } = req.params;

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: 'category' },
                {
                    association: 'belongs',
                    where: {
                        name: { [Op.iLike]: `%${department_name.toUpperCase()}%` }
                    },
                },
            ],
            order: [
                ['code']
            ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares) {
            return res.status(404).json({ error: 'Hardwares not found' });
        }

        return res.status(200).json({ hardwares });
    },

    async listHardwareByDepartmentAcronym(req, res) {
        const { department_acronym, limit, offset } = req.params;

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: 'category' },
                {
                    association: 'belongs',
                    where: {
                        acronym: { [Op.iLike]: `%${department_acronym.toUpperCase().replace("-", "/")}%` }
                    },
                },
            ],
            order: [
                ['code']
            ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares) {
            return res.status(404).json({ error: 'Hardwares not found' });
        }

        return res.status(200).json({ hardwares });
    },

    async listHardwareById(req, res) {
        const { hardware_id } = req.params;

        const hardware = await Hardware.findByPk(hardware_id, {
            include: [
                { association: 'category' },
                { association: 'belongs' }
            ],
        });

        if (!hardware) {
            return res.status(404).json({ error: 'Hardware not found' });
        }

        return res.status(200).json({ hardware });
    },

    async create(req, res) {
        const { type_id } = req.params;
        const {
            code,
            description,
            brand,
            warranty,
            has_office,
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
            code,
            description,
            brand,
            warranty,
            has_office,
            department_id,
            type_id
        });

        return res.status(201).json({ hardware });
    },

    async update(req, res) {
        const { hardware_id } = req.params;
        const {
            code,
            description,
            brand,
            warranty,
            has_office,
            department_id,
            type_id
        } = req.body;

        const hardware = await Hardware.findByPk(hardware_id, {
            include: [
                { association: 'category' },
                { association: 'belongs' }
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

        hardware.code = code;
        hardware.description = description;
        hardware.brand = brand;
        hardware.warranty = warranty;
        hardware.has_office = has_office;
        hardware.department_id = department_id;
        hardware.type_id = type_id;

        await hardware.save();

        return res.status(200).json({ hardware });
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