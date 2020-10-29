const { Op } = require("sequelize");

const Department = require('../models/Department');

module.exports = {
    async listAllDepartments(req, res) {
        const departments = await Department.findAll({
            order: [
                'name'
            ]
        });

        return res.json(departments);
    },

    async listDepartment(req, res) {
        const { department_id } = req.params;

        const department = await Department.findByPk(department_id);

        if (!department) {
            return res.status(404).json({ error: 'Department not found!' });
        }

        return res.json(department);
    },

    async listDepartmentByName(req, res) {
        const { department_name } = req.params;

        const department = await Department.findOne({
            where: {
                name: department_name.replace("-", "/")
            },
        });

        if (!department) {
            return res.json({ error: 'Department not found!', status: 404 });
        }

        return res.json(department);
    },

    async nameExists(req, res) {
        const { name } = req.params;

        if (name !== null) {
            const name_exists = await Department.findOne({
                where: {
                    name: name.toUpperCase().replace("-", "/")
                }
            });

            if (name_exists && name_exists.name) {
                return res.json({ name_exists: true, stauts: 200 });
            }

            return res.json({ name_exists: false, status: 200 });
        }

        return res.json({ name_exists: false, status: 200 });
    },

    async create(req, res) {
        const { name, boss } = req.body;

        const name_exists = await Department.findAll({
            where: {
                name: name.toUpperCase()
            }
        });

        if (name_exists.length != 0) {
            return res.json({ error: 'Name already exists!', status: 400 });
        }

        const department = await Department.create({ name, boss });

        return res.json({ department, status: 200 });
    },

    async update(req, res) {
        const { department_id } = req.params;
        const { name, boss } = req.body;

        const department = await Department.findByPk(department_id);
        const name_exists = await Department.findAll({
            where: {
                name
            }
        });

        if (!department) {
            return res.json({ error: 'Department not found!', status: 404 });
        }
        if (name_exists.length != 0 && name_exists[0].name != department.name) {
            return res.json({ error: 'Name is already being used!', stauts: 400 });
        }

        department.name = name;
        department.boss = boss;

        await department.save();

        return res.json({ department, status: 200 });
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