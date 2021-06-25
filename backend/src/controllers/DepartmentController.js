const { Op } = require("sequelize");

const Department = require("../models/Department");

module.exports = {
    async listAllDepartments(req, res) {
        const departments = await Department.findAll({
            order: ["acronym"]
        });

        if (!departments || departments.length === 0)
            return res.status(404).json({ error: "No department registered" });

        return res.status(200).json({ departments });
    },

    async listDepartmentById(req, res) {
        const { departmentId } = req.params;

        const department = await Department.findByPk(departmentId);

        if (!department)
            return res.status(404).json({ error: "Department not found!" });

        return res.status(200).json({ department });
    },

    async listDepartmentByName(req, res) {
        const { departmentName } = req.params;

        departmentName = departmentName.toUpperCase();

        const department = await Department.findOne({
            where: { name: departmentName }
        });

        if (!department)
            return res.status(404).json({ error: "Department not found!" });

        return res.status(200).json({ department });
    },

    async listDepartmentByAcronym(req, res) {
        let { departmentAcronym } = req.params;

        departmentAcronym = departmentAcronym.toUpperCase().replace("-", "/");

        const department = await Department.findOne({
            where: { acronym: departmentAcronym }
        });

        if (!department)
            return res.status(404).json({ error: "Department not found!" });

        return res.status(200).json({ department });
    },

    async verifyName(req, res) {
        let { departmentName } = req.params;

        departmentName = departmentName.toUpperCase();

        if (departmentName) {
            const nameExists = await Department.findOne({
                where: { name: departmentName }
            });

            if (nameExists && nameExists.name)
                return res.status(200).json({ nameExists: true });

            return res.status(200).json({ nameExists: false });
        }

        return res.status(400).json({ error: "Department name can't be empty!" });
    },

    async verifyAcronym(req, res) {
        let { departmentAcronym } = req.params;

        departmentAcronym = departmentAcronym.toUpperCase().replace("-", "/");

        if (departmentAcronym) {
            const acronymExists = await Department.findOne({
                where: { acronym: departmentAcronym }
            });

            if (acronymExists && acronymExists.acronym) 
                return res.status(200).json({ acronymExists: true });

            return res.status(200).json({ acronymExists: false });
        }

        return res.status(400).json({ error: "Department acronym can't be empty!" });
    },

    async create(req, res) {
        let { name, acronym, boss } = req.body;

        name = name.toUpperCase();
        acronym = acronym.toUpperCase().replace("-", "/");
        boss = boss.toUpperCase();

        const nameExists = await Department.findOne({
            where: { name }
        });
        const acronymExists = await Department.findOne({
            where: { acronym }
        });

        if (nameExists) {
            return res.status(400).json({ error: "Name already exists!" });
        }
        if (acronymExists) {
            return res.status(400).json({ error: "Acronym already exists!" });
        }

        const department = await Department.create({ name, acronym, boss });

        return res.status(201).json({ department });
    },

    async update(req, res) {
        const { departmentId } = req.params;
        let { name, acronym, boss } = req.body;

        name = name.toUpperCase();
        acronym = acronym.toUpperCase().replace("-", "/");
        boss = boss.toUpperCase();

        const department = await Department.findByPk(departmentId);
        const nameExists = await Department.findOne({
            where: { name }
        });

        const acronymExists = await Department.findOne({
            where: { acronym }
        });

        if (!department)
            return res.status(404).json({ error: "Department not found!" });

        if (nameExists && nameExists.name != department.name)
            return res.status(400).json({ error: "Name is already being used!" });

        if (acronymExists && acronymExists.name != department.acronym)
            return res.status(400).json({ error: "Acronym is already being used!" });

        department.name = name;
        department.acronym = acronym;
        department.boss = boss;

        await department.save();

        return res.status(200).json({ department });
    },

    async delete(req, res) {
        const { departmentId } = req.params;

        const department = await Department.findByPk(departmentId);

        if (!department)
            return res.status(404).json({ error: "Department not found!" });

        department.destroy();

        return res.status(204).json();
    },
}