const PublicAgency = require("../models/PublicAgency");

module.exports = {
    async listAllPublicAgencies(req, res) {
        const public_agencies = await PublicAgency.findAll({ order: ["name"] });

        return res.status(200).json({ public_agencies });
    },

    async listPublicAgencyById(req, res) {
        const { publicAgencyId } = req.params;

        const publicAgency = await PublicAgency.findByPk(publicAgencyId);

        if (!publicAgency)
            return res.status(404).json({ error: "Public agency not found!" });

        return res.status(200).json({ publicAgency });
    },

    async listPublicAgencyByName(req, res) {
        const { publicAgencyName } = req.params;

        publicAgencyName = publicAgencyName.toUpperCase();

        const publicAgency = await PublicAgency.findOne({
            where: { name: publicAgencyName }
        });

        if (!publicAgency)
            return res.status(400).json({ error: "Public agency not found!" });

        return res.status(200).json({ publicAgency });
    },

    async listPublicAgencyByAcronym(req, res) {
        const { publicAgencyAcronym } = req.params;

        publicAgencyAcronym = publicAgencyAcronym.toUpperCase().replace("-", "/");

        const publicAgency = await PublicAgency.findOne({
            where: { acronym: publicAgencyAcronym }
        });

        if (!publicAgency)
            return res.status(400).json({ error: "Public agency not found!" });

        return res.status(200).json({ publicAgency });
    },

    async verifyName(req, res) {
        const { name } = req.params;

        name = name.toUpperCase();

        if (name) {
            const nameExists = await Department.findOne({ where: { name } });

            if (nameExists && nameExists.name)
                return res.status(200).json({ nameExists: true });

            return res.status(200).json({ nameExists: false });
        }

        return res.status(400).json({ error: "Name to verify it can't be empty!" });
    },

    async verifyAcronym(req, res) {
        const { acronym } = req.params;

        acronym = acronym.toUpperCase().replace("-", "/");

        if (acronym) {
            const acronymExists = await PublicAgency.findOne({ where: { acronym } });

            if (acronymExists && acronymExists.acronym)
                return res.status(200).json({ acronymExists: true });

            return res.status(200).json({ acronymExists: false });
        }

        return res.status(400).json({ error: "Acronym to verify it can't be empty!" });
    },

    async create(req, res) {
        const { name, acronym } = req.body;

        name = name.toUpperCase();
        acronym = acronym.toUpperCase().replace("-", "/");

        const nameExists = await PublicAgency.findOne({ where: { name } });
        const acronymExists = await PublicAgency.findOne({ where: { acronym } });

        if (nameExists)
            return res.status(400).json({ error: "Name already exists!" });

        if (acronymExists)
            return res.status(400).json({ error: "Acronym already exists!" });

        const publicAgency = await PublicAgency.create({ name, acronym });

        return res.status(201).json({ publicAgency });
    },

    async update(req, res) {
        const { publicAgencyId } = req.params;
        const { name, acronym } = req.body;

        name = name.toUpperCase();
        acronym = acronym.toUpperCase().replace("-", "/");

        const publicAgency = await PublicAgency.findByPk(publicAgencyId);

        if (!publicAgency)
            return res.status(400).json({ error: "Public agency not found!" });

        const nameExists = await PublicAgency.findOne({ where: { name } });

        if (nameExists && nameExists.name != publicAgency.name)
            return res.status(400).json({ error: "Name is already being used!" });

        const acronymExists = await PublicAgency.findOne({ where: { acronym } })

        if (acronymExists && acronymExists.acronym != publicAgency.acronym)
            return res.status(400).json({ error: "Acronym is already being used!" });

        publicAgency.name = name;
        publicAgency.acronym = acronym;

        await publicAgency.save();

        return res.status(200).json({ publicAgency });
    },

    async delete(req, res) {
        const { publicAgencyId } = req.params;

        const publicAgency = await PublicAgency.findByPk(publicAgencyId);

        if (!publicAgency)
            return res.status(404).json({ error: "Public agency not found!" });

        publicAgency.destroy();

        return res.status(204).json();
    },
}