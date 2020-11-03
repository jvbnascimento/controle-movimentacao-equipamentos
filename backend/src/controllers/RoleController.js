const Role = require('../models/Role');

module.exports = {
	async listAllRoles(req, res) {
		const roles = await Role.findAll();

		return res.json(roles);
    },
    
	async listRole(req, res) {
		const { role_id } = req.params;

		const role = await Role.findByPk(role_id);
		
		if (!role) {
			return res.status(404).json({ error: 'Role not found!' });
		}

		return res.json(role);
    },
    
    async listRoleByName(req, res) {
		const { name } = req.params;

		const role = await Role.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
		
		if (!role) {
			return res.json({ error: 'Role not found!', status: 404 });
		}

		return res.json({ role, status: 200 });
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
                return res.json({ name_exists: true, stauts: 200 });
            }

			return res.json({ name_exists: false, status: 200 });
		}

		return res.json({ name_exists: false, status: 200 });
	},

	async create(req, res) {
		const { name } = req.body;
        
        const name_exists = await Role.findAll({
            where: { name: name.toUpperCase() } 
        });

        if (name_exists.length != 0) {
            return res.json({ error: 'Name already exists!', status: 404 });
        }

		const role = await Role.create({ name: name.toUpperCase() });

		return res.json({ role, status: 201 });
    },
    
    async update(req, res) {
        const { role_id } = req.params;
        const { name } = req.body;
        
        const role = await Role.findByPk(role_id);
        const name_exists = await Role.findAll({
            where: { name } 
        });

        if (!role) {
            return res.json({ error: 'Role not found!', status: 404 });
        }
        if (name_exists.length != 0) {
            return res.json({ error: 'Name is already being used!', status: 400 });
        }

        role.name = name;
        
        await role.save();

		return res.json({ role, status: 200 });
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