const { Op } = require("sequelize");

const Category = require("../models/Category");
const Hardware = require("../models/Hardware");
const Department = require("../models/Department");
const PublicAgency = require("../models/PublicAgency");

module.exports = {
    async listAllHardwares(req, res) {
        const filters = req.query;

        let limit = 10;
        let offset = 1;

        let hardwareFilters = {}
        let belongsDepartmentFilters = {}
        let belongsPublicAgencyFilters = {}
        let categoryFilters = {}

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }
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
        if (filters.belongs_department) {
            belongsDepartmentFilters.name = {
                [Op.like]: `%${filters.belongs_department.toUpperCase()}%`
            }
        }
        if (filters.belongs_public_agency) {
            belongsPublicAgencyFilters.name = {
                [Op.like]: `%${filters.belongs_public_agency.toUpperCase()}%`
            }
        }

        const hardwares = await Hardware.findAndCountAll({
            include: [
                {
                    association: "category",
                    required: true,
                    where: categoryFilters,
                },
                {
                    association: "belongs_department",
                    required: true,
                    where: belongsDepartmentFilters,
                },
                {
                    association: "belongs_public_agency",
                    required: true,
                    where: belongsPublicAgencyFilters,
                },
            ],
            where: hardwareFilters,
            order: [["code"]],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
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
                { association: "category" },
                { association: "belongs_department" },
                { association: "belongs_public_agency" }
            ],
        });

        return res.status(200).json({ hardwares });
    },

    async listAllHardwaresByCategory(req, res) {
        const { categoryName } = req.params;

        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        const hardwares = await Hardware.findAndCountAll({
            include: [
                {
                    association: "category",
                    where: {
                        name: { [Op.iLike]: `%${categoryName.toUpperCase()}%` }
                    }
                },
                { association: "belongs_department" },
                { association: "belongs_public_agency" }
            ],
            order: [ ["code"] ],
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
                code: { [Op.iLike]: `%${code}%` }
            },
            include: [
                { association: "category" },
                { association: "belongs_department" },
                { association: "belongs_public_agency" }
            ],
        });

        if (!hardware) 
            return res.status(404).json({ error: "Hardware not found" });

        return res.status(200).json({ hardware });
    },

    async listHardwareByDepartmentId(req, res) {
        const { departmentId } = req.params;

        const hardwares = await Hardware.findAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_department",
                    where: { id: parseInt(departmentId) },
                },
                { association: "belongs_public_agency" },
            ],
            order: [ ["code"] ],
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardware not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByPublicAgencyId(req, res) {
        const { publicAgencyId } = req.params;

        const hardwares = await Hardware.findAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_public_agency",
                    where: { id: parseInt(publicAgencyId) },
                },
                { association: "belongs_department" },
            ],
            order: [ ["code"] ],
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardware not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByDepartmentName(req, res) {
        const { departmentName } = req.params;

        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        departmentName = departmentName.toUpperCase();

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_department",
                    where: {
                        name: { [Op.iLike]: `%${departmentName}%` }
                    },
                },
                { association: "belongs_public_agency" },
            ],
            order: [ ["code"] ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardwares not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByDepartmentAcronym(req, res) {
        const { departmentAcronym } = req.params;

        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        departmentAcronym = departmentAcronym.toUpperCase().replace("-", "/");

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_department",
                    where: {
                        acronym: { [Op.iLike]: `%${departmentAcronym}%` }
                    },
                },
                { association: "belongs_public_agency" },
            ],
            order: [ ["code"] ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardwares not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByPublicAgencyName(req, res) {
        const { publicAgencyName } = req.params;

        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        publicAgencyName = publicAgencyName.toUpperCase();

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_public_agency",
                    where: {
                        name: { [Op.iLike]: `%${publicAgencyName}%` }
                    },
                },
                { association: "belongs_department" },
            ],
            order: [ ["code"] ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardwares not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareByPublicAgencyAcronym(req, res) {
        const { publicAgencyAcronym } = req.params;

        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        publicAgencyAcronym = publicAgencyAcronym.toUpperCase().replace("-", "/");

        const hardwares = await Hardware.findAndCountAll({
            include: [
                { association: "category" },
                {
                    association: "belongs_public_agency",
                    where: {
                        acronym: { [Op.iLike]: `%${publicAgencyAcronym}%` }
                    },
                },
                { association: "belongs_department" },
            ],
            order: [ ["code"] ],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!hardwares)
            return res.status(404).json({ error: "Hardwares not found" });

        return res.status(200).json({ hardwares });
    },

    async listHardwareById(req, res) {
        const { hardwareId } = req.params;

        const hardware = await Hardware.findByPk(hardwareId, {
            include: [
                { association: "category" },
                { association: "belongs_department" },
                { association: "belongs_public_agency" }
            ],
        });

        if (!hardware)
            return res.status(404).json({ error: "Hardware not found" });

        return res.status(200).json({ hardware });
    },

    async create(req, res) {
        const { categoryId } = req.params;
        const {
            code,
            description,
            brand,
            warranty,
            hasOffice,
            departmentId,
            publicAgencyId
        } = req.body;

        const category = await Category.findByPk(categoryId);

        if (!category)
            return res.status(404).json({ error: "Category not found" });

        const publicAgency = await PublicAgency.findByPk(publicAgencyId);

        if (!publicAgency)
            return res.status(404).json({ error: "Public agency not found" });

        let department;

        if (departmentId) {
            department = await Department.findByPk(departmentId);

            if (!department)
                return res.status(404).json({ error: "Department not found" });
        }

        description = description.toUpperCase();
        brand = brand.toUpperCase();

        const hardware = await Hardware.create({
            code,
            description,
            brand,
            warranty,
            has_office: hasOffice,
            department_id: departmentId ? departmentId : null,
            public_agency_id: publicAgencyId,
            category_id: categoryId
        });

        return res.status(201).json({ hardware });
    },

    async update(req, res) {
        const { hardwareId } = req.params;
        const {
            code,
            description,
            brand,
            warranty,
            hasOffice,
            departmentId,
            publicAgencyId,
            categoryId
        } = req.body;

        const hardware = await Hardware.findByPk(hardwareId, {
            include: [
                { association: "category" },
                { association: "belongs_department" },
                { association: "belongs_public_agency" },
            ],
        });

        if (!hardware)
            return res.status(404).json({ error: "Hardware not found" });

        const category = await Category.findByPk(categoryId);

        if (!category)
            return res.status(404).json({ error: "Category not found" });

        const publicAgency = await PublicAgency.findByPk(publicAgencyId);

        if (!publicAgency)
            return res.status(404).json({ error: "Public agency not found" });

        let department;

        if (departmentId) {
            department = await Department.findByPk(departmentId);

            if (!department)
                return res.status(404).json({ error: "Department not found" });
        }

        description = description.toUpperCase();
        brand = brand.toUpperCase();

        hardware.code = code;
        hardware.description = description;
        hardware.brand = brand;
        hardware.warranty = warranty;
        hardware.has_office = hasOffice;
        hardware.department_id = departmentId ? departmentId : null;
        hardware.public_agency_id = publicAgencyId;
        hardware.category_id = categoryId;

        await hardware.save();

        return res.status(200).json({ hardware });
    },

    async delete(req, res) {
        const { hardwareId } = req.params;

        const hardware = await Hardware.findByPk(hardwareId);

        if (!hardware)
            return res.status(404).json({ error: "Hardware not found" });

        await hardware.destroy();

        return res.status(204).json();
    },
}