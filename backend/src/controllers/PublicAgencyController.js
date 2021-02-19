const { Op } = require("sequelize");

const PublicAgency = require('../models/PublicAgency');

module.exports = {
    async listAllPublicAgencies(req, res) {
        const public_agencies = await PublicAgency.findAll({
            order: [
                'name'
            ]
        });

        return res.json({ public_agencies });
    },

    async listPublicAgency(req, res) {
        const { public_agency_id } = req.params;

        const public_agency = await PublicAgency.findByPk(public_agency_id);

        if (!public_agency) {
            return res.status(404).json({ error: 'PublicAgency not found!' });
        }

        return res.json({ public_agency });
    },

    async listPublicAgencyByName(req, res) {
        const { public_agency_name } = req.params;

        const public_agency = await PublicAgency.findOne({
            where: {
                name: public_agency_name.toUpperCase()
            },
        });

        if (!public_agency) {
            return res.status(400).json({ error: 'PublicAgency not found!' });
        }

        return res.json({ public_agency });
    },

    async listPublicAgencyByAcronym(req, res) {
        const { public_agency_acronym } = req.params;

        const public_agency = await PublicAgency.findOne({
            where: {
                acronym: public_agency_acronym.toUpperCase().replace("-", "/")
            },
        });

        if (!public_agency) {
            return res.status(400).json({ error: 'PublicAgency not found!' });
        }

        return res.json({ public_agency });
    },

    async nameExists(req, res) {
        const { name } = req.params;

        if (name !== null) {
            const name_exists = await PublicAgency.findOne({
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
            const acronym_exists = await PublicAgency.findOne({
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
        const { name, acronym } = req.body;

        const name_exists = await PublicAgency.findAll({
            where: {
                name: name.toUpperCase()
            }
        });

        if (name_exists.length != 0) {
            return res.status(400).json({ error: 'Name already exists!' });
        }

        const public_agency = await PublicAgency.create({ name: name.toUpperCase(), acronym: acronym.toUpperCase() });

        return res.status(201).json({ public_agency });
    },

    async update(req, res) {
        const { public_agency_id } = req.params;
        const { name, acronym } = req.body;

        const public_agency = await PublicAgency.findByPk(public_agency_id);
        const name_exists = await PublicAgency.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
        const acronym_exists = await PublicAgency.findOne({
            where: {
                acronym: acronym.toUpperCase().replace('-', '/')
            }
        })

        if (!public_agency) {
            return res.status(400).json({ error: 'PublicAgency not found!' });
        }
        if (name_exists.length != 0 && name_exists[0].name != public_agency.name) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }
        if (acronym_exists.length != 0 && acronym_exists[0].acronym != public_agency.acronym) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }

        public_agency.name = name.toUpperCase();
        public_agency.acronym = acronym.toUpperCase();

        await public_agency.save();

        return res.status(200).json({ public_agency });
    },

    async delete(req, res) {
        const { public_agency_id } = req.params;

        const public_agency = await PublicAgency.findByPk(public_agency_id);

        if (!public_agency) {
            return res.status(404).json({ error: 'PublicAgency not found!' });
        }

        public_agency.destroy();

        return res.status(204).json();
    },
}