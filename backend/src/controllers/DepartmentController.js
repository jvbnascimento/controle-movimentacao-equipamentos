const { Op } = require("sequelize");

const Department = require('../models/Department');

module.exports = {
    async listAllDepartments(req, res) {
        const departments = await Department.findAll({
            order: [
                'acronym'
            ]
        });

        return res.json({ departments });
    },

    async listDepartment(req, res) {
        const { department_id } = req.params;

        const department = await Department.findByPk(department_id);

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }

        return res.json({ department });
    },

    async listDepartmentByName(req, res) {
        const { department_name } = req.params;

        const department = await Department.findOne({
            where: {
                name: department_name.toUpperCase()
            },
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }

        return res.json({ department });
    },

    async listDepartmentByAcronym(req, res) {
        const { department_acronym } = req.params;

        const department = await Department.findOne({
            where: {
                acronym: department_acronym.toUpperCase().replace('-', '/')
            },
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }

        return res.json({ department });
    },

    async nameExists(req, res) {
        const { name } = req.params;

        if (name !== null) {
            const name_exists = await Department.findOne({
                where: {
                    name: name.toUpperCase()
                }
            });

            if (name_exists && name_exists.name) {
                return res.status(200).json({ name_exists: true });
            }

            return res.status(200).json({ name_exists: false });
        }

        return res.status(200).json({ name_exists: false });
    },

    async acronymExists(req, res) {
        const { acronym } = req.params;

        if (acronym !== null) {
            const acronym_exists = await Department.findOne({
                where: {
                    acronym: acronym.toUpperCase().replace("-", "/")
                }
            });

            if (acronym_exists && acronym_exists.acronym) {
                return res.status(200).json({ acronym_exists: true });
            }

            return res.status(200).json({ acronym_exists: false });
        }

        return res.status(200).json({ acronym_exists: false });
    },

    async create(req, res) {
        const { name, acronym, boss } = req.body;

        const name_exists = await Department.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
        const acronym_exists = await Department.findOne({
            where: {
                acronym: acronym.toUpperCase().replace("-", "/")
            }
        });

        if (name_exists) {
            return res.status(400).json({ error: 'Name already exists!' });
        }
        if (acronym_exists) {
            return res.status(400).json({ error: 'Acronym already exists!' });
        }

        const department = await Department.create({ name: name.toUpperCase(), acronym: acronym.toUpperCase(), boss: boss.toUpperCase() });

        return res.status(200).json({ department });
    },

    async update(req, res) {
        const { department_id } = req.params;
        const { name, acronym, boss } = req.body;

        const department = await Department.findByPk(department_id);
        const name_exists = await Department.findOne({
            where: {
                name: name.toUpperCase()
            }
        });

        const acronym_exists = await Department.findOne({
            where: {
                name: acronym.toUpperCase().replace("-", "/")
            }
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }
        if (name_exists && name_exists.name != department.name) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }
        if (acronym_exists && acronym_exists.name != department.acronym) {
            return res.status(400).json({ error: 'Acronym is already being used!' });
        }

        department.name = name.toUpperCase();
        department.acronym = acronym.toUpperCase();
        department.boss = boss.toUpperCase();

        await department.save();

        return res.status(200).json({ department });
    },

    async delete(req, res) {
        const { department_id } = req.params;

        const department = await Department.findByPk(department_id);

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }

        department.destroy();

        return res.status(204).json();
    },
}