const { Op } = require("sequelize");

const MovementType = require("../models/MovementType");

module.exports = {
    async listAllMovementTypes(req, res) {
        const movementTypes = await MovementType.findAll();

        return res.status(200).json({ movementTypes });
    },

    async listMovementType(req, res) {
        const { movementTypeId } = req.params;

        const movementType = await MovementType.findByPk(movementTypeId);

        if (!movementType)
            return res.status(404).json({ error: "Movement type not found!" });

        return res.status(200).json({ movementType });
    },

    async listMovementTypeByDescription(req, res) {
        const { description } = req.params;

        const movementType = await MovementType.findAll({
            where: {
                description: { [Op.iLike]: `%${description.toUpperCase()}%` }
            }
        });

        if (!movementType)
            return res.status(404).json({ error: "Movement type not found!" });1

        return res.status(200).json({ movementType });
    },

    async verifyDescription(req, res) {
        const { description } = req.params;

        if (description) {
            const movementType = await MovementType.findOne({
                where: {
                    description: { [Op.iLike]: `%${description.toUpperCase()}%` }
                }
            });

            if (movementType && movementType.description)
                return res.status(200).json({ nameExists: true });

            return res.status(200).json({ nameExists: false });
        }

        return res.status(400).json({ error: "Description can't be empty!" });
    },

    async create(req, res) {
        const { description } = req.body;

        description = description.toUpperCase();

        const nameExists = await MovementType.findOne({
            where: {
                description: { [Op.iLike]: `%${description}%` }
            }
        });

        if (nameExists)
            return res.status(404).json({ error: "Description already exists!" });

        const movementType = await MovementType.create({ description });

        return res.status(201).json({ movementType });
    },

    async update(req, res) {
        const { movementTypeId } = req.params;
        const { description } = req.body;

        description = description.toUpperCase();

        const movementType = await MovementType.findByPk(movementTypeId);
        const nameExists = await MovementType.findOne({
            where: {
                description: { [Op.iLike]: `%${description}%` }
            }
        });

        if (!movementType)
            return res.status(404).json({ error: "Movement type not found!" });

        if (nameExists)
            return res.status(400).json({ error: "Description is already being used!" });

        movementType.description = description;

        await movementType.save();

        return res.status(200).json({ movementType });
    },

    async delete(req, res) {
        const { movementTypeId } = req.params;

        const movementType = await MovementType.findByPk(movementTypeId);

        if (!movementType)
            return res.status(404).json({ error: "Movement type not found!" });

        await movementType.destroy();

        return res.status(204).json();
    },
}