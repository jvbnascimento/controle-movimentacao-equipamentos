const User = require("../models/User");
const Movement = require("../models/Movement");
const Hardware = require("../models/Hardware");
const Department = require("../models/Department");
const PublicAgency = require("../models/PublicAgency");
const MovementType = require("../models/MovementType");

const { Op } = require("sequelize");

module.exports = {
    async listAllMovements(req, res) {
        const filters = req.query;

        let limit = 10;
        let offset = 1;

        if (filters.limit) {
            limit = filters.limit;
        }
        if (filters.offset) {
            offset = filters.offset;
        }

        const movements = await Movement.findAndCountAll({
            include: [
                { association: "previous_department" },
                { association: "next_department" },
                { association: "next_agency" },
                { association: "responsible" },
                {
                    association: "hardwares",
                    through: { attributes: [] },
                    include: [
                        { association: "category" },
                        { association: "belongs_department" },
                        { association: "belongs_public_agency" }
                    ],
                },
                { association: "type" }
            ],
            order: [["id", "DESC"]],
            limit,
            offset: (offset - 1) * limit,
            distinct: true,
            subQuery: false
        });

        if (!movements)
            return res.status(404).json({ error: "No registered movements" });

        return res.status(200).json({ movements });
    },

    async listMovementById(req, res) {
        const { movementId } = req.params;

        const movement = await Movement.findByPk(movementId, {
            include: [
                { association: "previous_department", },
                { association: "next_department", },
                { association: "next_agency" },
                { association: "responsible", },
                {
                    association: "hardwares",
                    through: { attributes: [] },
                    include: [
                        { association: "category" },
                        { association: "belongs_department" },
                        { association: "belongs_public_agency" }
                    ],
                },
                { association: "type" }
            ]
        });

        if (!movement)
            return res.status(404).json({ error: "Movement not found!" });

        return res.status(200).json({ movement });
    },

    async listAllMovementsByData(req, res) {
        const { movementDate } = req.params;

        const movements = await Movement.findAll({
            where: { movementDate },
            include: [
                { association: "previous_department", },
                { association: "next_department", },
                { association: "next_agency" },
                { association: "responsible", },
                {
                    association: "hardwares",
                    through: { attributes: [] },
                    include: [
                        { association: "category" },
                        { association: "belongs_department" },
                        { association: "belongs_public_agency" }
                    ],
                },
                { association: "type" }
            ]
        });

        return res.status(200).json({ movements });
    },

    async listAllMovementsByCode(req, res) {
        const { code } = req.params

        const movements = await Movement.findAll({
            include: [
                { association: "previous_department" },
                { association: "next_department" },
                { association: "next_agency" },
                { association: "responsible" },
                {
                    association: "hardwares",
                    where: {
                        code: { [Op.iLike]: `%${code}%` }
                    },
                    through: { attributes: [] },
                    include: [
                        { association: "category" },
                        { association: "belongs_department" },
                        { association: "belongs_public_agency" }
                    ],
                },
                { association: "type" }
            ],
            order: [["id", "DESC"]]
        });

        return res.status(200).json({ movements });
    },

    async listAllMovementsByAdvancedSearch(req, res) {
        try {
            const filters = req.query;

            let limit = 10;
            let offset = 1;
            let movementFilters = {}
            let hardwareFilters = {}
            let belongsDepartmentFilters = {}
            let belongsPublicAgencyFilters = {}
            let categoryFilters = {}

            const format_date = (date) => {
                const newDate = date.split("/");
                newDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0];

                return newDate;
            }

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
                    [Op.like]: `%${filters.warranty}%`
                }
            }
            if (filters.hasOffice) {
                hardwareFilters.hasOffice = {
                    [Op.like]: `%${filters.hasOffice.toUpperCase()}%`
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
            if (filters.movementDate) {
                const movementDate = format_date(filters.movementDate);

                movementFilters.movementDate = {
                    [Op.eq]: `${movementDate}`
                }
            }

            const movements = await Movement.findAndCountAll({
                include: [
                    {
                        association: "previous_department",
                        required: false,
                    },
                    {
                        association: "next_department",
                        required: false,
                    },
                    {
                        association: "next_agency",
                        required: false,
                    },
                    {
                        association: "responsible",
                        required: false,
                    },
                    {
                        association: "hardwares",
                        required: true,
                        where: hardwareFilters,
                        through: { attributes: [] },
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
                        ]
                    },
                    { association: "type" }
                ],
                where: movementFilters,
                order: [["id", "DESC"]],
                limit,
                offset: (offset - 1) * limit,
                distinct: true,
                subQuery: false,
            });

            return res.status(200).json({ movements });
        }
        catch (e) {
            return res.status(400).json({ error: "Não foi possível realizar a execução da Query" });
        }

    },

    async create(req, res) {
        const {
            movementDate,
            originDepartmentId,
            destinationDepartmentId,
            nextAgencyId,
            responsibleId,
            movementTypeId,
            hardwareList,
        } = req.body;

        if (originDepartmentId) {
            const originDepartment = Department.findByPk(originDepartmentId);

            if (!originDepartment)
                return res.status(404).json({ error: "Origin department not found!" });
        }
        if (destinationDepartmentId) {
            const destinationDepartment = Department.findByPk(destinationDepartmentId);

            if (!destinationDepartment)
                return res.status(404).json({ error: "Destination department not found!" });
        }
        if (nextAgencyId) {
            const nextAgency = PublicAgency.findByPk(nextAgencyId);

            if (!nextAgency)
                return res.status(404).json({ error: "Public agency not found!" });
        }
        if (responsibleId) {
            const responsible = User.findByPk(responsibleId);

            if (!responsible)
                return res.status(404).json({ error: "Responsible not found!" });
        }
        if (movementTypeId) {
            const movementType = MovementType.findByPk(movementTypeId);

            if (!movementType)
                return res.status(404).json({ error: "Movement type not found!" });
        }

        Movement.create({
            movement_date: movementDate,
            origin_department_id: originDepartmentId,
            destination_department_id: destinationDepartmentId,
            public_agency_id: nextAgencyId,
            responsible_id: responsibleId,
            movement_type_id: movementTypeId
        }).then(async (movement) => {
            hardwareList.map(async (element) => {
                const hardware = await Hardware.findByPk(element.id);

                if (hardware) {
                    hardware.department_id = destinationDepartmentId;
                    hardware.public_agency_id = nextAgencyId;

                    await hardware.save();
                    await movement.addHardware(hardware);
                }
            });

            return res.status(201).json({ movement });
        }).catch((err) => {
            return res.status(400).json({ error: err });
        });
    },

    async update(req, res) {
        const { movementId } = req.params;
        const {
            movementDate,
            originDepartmentId,
            destinationDepartmentId,
            nextAgencyId,
            responsibleId,
            movementTypeId,
            hardwareList,
        } = req.body;

        if (!await Movement.findByPk(movementId))
            return res.status(404).json({ error: "Movement not found!" });

        if (!await Department.findByPk(originDepartmentId))
            return res.status(404).json({ error: "Origin department not found!" });

        if (destinationDepartmentId) {
            if (!await Department.findByPk(destinationDepartmentId))
                return res.status(404).json({ error: "Destination department not found!" });
        }

        if (!await PublicAgency.findByPk(nextAgencyId))
            return res.status(404).json({ error: "Public agency not found!" });

        if (!await User.findByPk(responsibleId))
            return res.status(404).json({ error: "User not found!" });

        if (!await MovementType.findByPk(movementTypeId))
            return res.status(404).json({ error: "Movement type not found!" });

        if (hardwareList.length === 0)
            return res.status(400).json({ error: "Hardware list cannot be empty!" });

        await Movement.findByPk(movementId, {
            include: { association: "hardwares" }
        }).then(async (movement) => {
            movement.hardwares.map(async (element) => {
                const hardware = await Hardware.findByPk(element.id);

                if (hardware) {
                    hardware.department_id = originDepartmentId;
                    hardware.public_agency_id = publicAgencyId;

                    await hardware.save();
                }
            });

            await movement.setHardwares([]);

            hardwares.map(async (element) => {
                const hardware = await Hardware.findByPk(element.id);

                if (hardware) {
                    hardware.departmentId = destinationDepartmentId;
                    hardware.public_agency_id = publicAgencyId;

                    await hardware.save();
                    await movement.addHardware(hardware);
                }
            });

            movement.movement_date = movementDate;
            movement.origin_department_id = originDepartmentId;
            movement.destination_department_id = destinationDepartmentId;
            movement.public_agency_id = nextAgencyId;
            movement.responsible_id = responsibleId;
            movement.movement_type_id = movementTypeId;

            await movement.save();

            return res.status(200).json({ movement });
        }).catch((err) => {
            return res.status(400).json({ error: err });
        });
    },

    async delete(req, res) {
        const { movementId } = req.params;

        const movement = await Movement.findByPk(movementId);

        if (!movement)
            return res.status(404).json({ error: "Movement not found!" });

        await movement.destroy();

        return res.status(204).json();
    },
}