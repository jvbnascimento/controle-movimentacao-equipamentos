const { response } = require('express');
const Role = require('../models/Role');

module.exports = {
	async listAllRoles(req, res) {
		const roles = await Role.findAll();

		return res.status(200).json({ roles });
    },
    
	async listRole(req, res) {
		const { role_id } = req.params;

		const role = await Role.findByPk(role_id);
		
		if (!role) {
			return res.status(400).json({ error: 'Role not found!' });
		}

		return res.status(200).json({ role });
    },
    
    async listRoleByName(req, res) {
		const { name } = req.params;

		const role = await Role.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
		
		if (!role) {
			return res.status(400).json({ error: 'Role not found!' });
		}

		return res.status(200).json({ role });
	},
    
	async nameExists(req, res) {
		const { name } = req.params;

		if (name !== null) {
			const role = await Role.findOne({
				where: {
					name: name.toUpperCase()
				}
            });
			
			if (role && role.name) {
                return res.status(200).json({ name_exists: true });
            }

			return res.status(200).json({ name_exists: false });
		}

		return res.status(200).json({ name_exists: false });
	},

	async create(req, res) {
		const { name } = req.body;
        
        const name_exists = await Role.findAll({
            where: { name: name.toUpperCase() } 
        });

        if (name_exists.length != 0) {
            return res.status(400).json({ error: 'Name already exists!' });
        }

		const role = await Role.create({ name: name.toUpperCase() });

		return res.status(201).json({ role });
    },
    
    async update(req, res) {
        const { role_id } = req.params;
        const { name } = req.body;
        
        const role = await Role.findByPk(role_id);
        const name_exists = await Role.findAll({
            where: { name } 
        });

        if (!role) {
            return res.status(400).json({ error: 'Role not found!' });
        }
        if (name_exists.length != 0) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }

        role.name = name;
        
        await role.save();

		return res.status(200).json({ role });
    },
    
    async delete(req, res) {
        const { role_id } = req.params;
        
        const role = await Role.findByPk(role_id);

        if (!role) {
            return res.status(404).json({ error : 'Role not found!' });
        }
        
        await role.destroy();

		return res.status(204).json();
	},
}