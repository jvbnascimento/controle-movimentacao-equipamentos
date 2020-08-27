const Movement = require('../models/Movement');
const Hardware = require('../models/Hardware');
const User = require('../models/User');
const Department = require('../models/Department');
const { Op } = require('sequelize');

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
            distinct: true
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
        const { parameters } = req.params
        const params = [];
        const values = [];

        const transformParameters = JSON.parse(parameters);

        transformParameters.parameters.map(element => {
            params.push(element.param);
        });

        transformParameters.body.map(element => {
            values.push(element.body);
        });

        let queryString = "";

        params.map((element, index) => {
            if (
                element.toUpperCase() === 'HERITAGE' ||
                element.toUpperCase() === 'BRAND' ||
                element.toUpperCase() === 'WARRANTY' ||
                element.toUpperCase() === 'HAS_OFFICE' ||
                element.toUpperCase() === 'CATEGORY' ||
                element.toUpperCase() === 'DEPARTMENT'
            ) {
                if (index == (params.length - 1)) {
                    if (element.toUpperCase() === 'CATEGORY') {
                        queryString += "types.name LIKE '%" + values[index].toUpperCase() + "%'"
                    }
                    else if (element.toUpperCase() === 'DEPARTMENT') {
                        queryString += "departments.name LIKE '%" + values[index].replace('-', '/').toUpperCase() + "%'"
                    }
                    else if (element.toUpperCase() === 'WARRANTY') {
                        queryString += element.toUpperCase() + " LIKE '%" + values[index].replace('-', '/').replace('-', '/').toUpperCase() + "%'"
                    }
                    else {
                        queryString += element.toUpperCase() + " LIKE '%" + values[index].toUpperCase() + "%'"
                    }
                }
                else {
                    if (element.toUpperCase() === 'CATEGORY') {
                        queryString += "types.name LIKE '%" + values[index].toUpperCase() + "%' AND "
                    }
                    else if (element.toUpperCase() === 'DEPARTMENT') {
                        queryString += "departments.name LIKE '%" + values[index].replace('-', '/').toUpperCase() + "%' AND "
                    }
                    else if (element.toUpperCase() === 'WARRANTY') {
                        queryString += element.toUpperCase() +  " LIKE '%" + values[index].replace('-', '/').replace('-', '/').toUpperCase().toUpperCase() + "%' AND "
                    }
                    else {
                        queryString += element.toUpperCase() + " LIKE '%" + values[index].toUpperCase() + "%' AND "
                    }
                }
            }
            else if (
                element.toUpperCase() === 'AUCTION' ||
                element.toUpperCase() === 'DATE_MOVEMENT'
            ) {
                if (index == (params.length - 1)) {
                    if (element.toUpperCase() === 'AUCTION') {
                        queryString += element.toUpperCase() + " = " + values[index] + " "
                    }
                    else {
                        queryString += element.toUpperCase() + " = '" + values[index].replace('-', '/') + "' "
                    }
                }
                else {
                    if (element.toUpperCase() === 'AUCTION') {
                        queryString += element.toUpperCase() + " = " + values[index] + " AND "
                    }
                    else {
                        queryString += element.toUpperCase() + " = '" + values[index].replace('-', '/') + "' AND "
                    }
                }
            }
        });

        try {
            const [results] = await Movement.sequelize.query(
                `
                    SELECT 
                        movements.id,
                        movements.date_movement,
                        previous_department.id as previous_department_id,
                        previous_department.name as previous_department_name,
                        previous_department.boss as previous_department_boss,
                        next_department.id as next_department_id,
                        next_department.name as next_department_name,
                        next_department.boss as next_department_boss,
                        responsible.id as responsible_id,
                        responsible.name as responsible_name,
                        hardwares.id,
                        hardwares.heritage,
                        hardwares.description,
                        hardwares.brand,
                        hardwares.warranty,
                        hardwares.has_office,
                        hardwares.auction,
                        hardwares.date_auction,
                        category.id as category_id,
                        category.name as category_name,
                        belongs.id as belongs_id,
                        belongs.name as belongs_name,
                        belongs.boss as belongs_boss
                    FROM movements
                    INNER JOIN departments AS previous_department ON movements.origin_department_id = previous_department.id
                    INNER JOIN departments AS next_department ON movements.destination_department_id = next_department.id
                    INNER JOIN users AS responsible ON movements.responsible_id = responsible.id
                    INNER JOIN movement_hardwares ON movements.id = movement_hardwares.movement_id
                    INNER JOIN hardwares ON movement_hardwares.hardware_id = hardwares.id
                    INNER JOIN types as category ON hardwares.type_id = category.id
                    INNER JOIN departments as belongs ON hardwares.department_id = belongs.id
                    WHERE ${queryString}
                `,
            );

            return res.json(results);
        }
        catch(e) {
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