const TypeMovement = require('../models/TypeMovement');
const { Op } = require('sequelize');

module.exports = {
    async listAllTypeMovement(req, res) {
        const typeMovements = await TypeMovement.findAll();

        return res.json({ typeMovements });
    },

    async listTypeMovement(req, res) {
        const { type_movement_id } = req.params;

        const typeMovement = await TypeMovement.findByPk(type_movement_id);

        if (!typeMovement) {
            return res.status(404).json({ error: 'TypeMovement not found!' });
        }

        return res.json(typeMovement);
    },

    async listTypeMovementByDescription(req, res) {
        const { description } = req.params;

        const typeMovement = await TypeMovement.findAll({
            where: {
                description: {
                    [Op.iLike]: `%${description.toUpperCase()}%`
                }
            }
        });

        if (!typeMovement) {
            return res.status(404).json({ error: 'TypeMovement not found!' });
        }

        return res.status(200).json({ typeMovement });
    },

    async nameExists(req, res) {
        const { description } = req.params;

        if (description !== null) {
            const typeMovement = await TypeMovement.findOne({
                where: {
                    description: {
                        [Op.iLike]: `%${description.toUpperCase()}%`
                    }
                }
            });

            if (typeMovement && typeMovement.description) {
                return res.status(200).json({ name_exists: true });
            }

            return res.status(200).json({ name_exists: false });
        }

        return res.status(200).json({ name_exists: false });
    },

    async create(req, res) {
        const { description } = req.body;

        const name_exists = await TypeMovement.findAll({
            where: {
                description: {
                    [Op.iLike]: `%${description.toUpperCase()}%`
                }
            }
        });

        if (name_exists.length != 0) {
            return res.status(404).json({ error: 'Name already exists!' });
        }

        const typeMovement = await TypeMovement.create({ description: description.toUpperCase() });

        return res.status(201).json({ typeMovement });
    },

    async update(req, res) {
        const { type_movement_id } = req.params;
        const { description } = req.body;

        const typeMovement = await TypeMovement.findByPk(type_movement_id);
        const name_exists = await TypeMovement.findAll({
            where: {
                description: {
                    [Op.iLike]: `%${description.toUpperCase()}%`
                }
            }
        });

        if (!typeMovement) {
            return res.status(404).json({ error: 'TypeMovement not found!' });
        }
        if (name_exists.length != 0) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }

        typeMovement.description = description;

        await typeMovement.save();

        return res.status(200).json({ typeMovement });
    },

    async delete(req, res) {
        const { type_movement_id } = req.params;

        const typeMovement = await TypeMovement.findByPk(type_movement_id);

        if (!typeMovement) {
            return res.status(404).json({ error: 'TypeMovement not found!' });
        }

        await typeMovement.destroy();

        return res.status(204).json();
    },
}