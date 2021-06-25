const Role = require("../models/Role");

module.exports = {
	async listAllRoles(req, res) {
		const roles = await Role.findAll();

		return res.status(200).json({ roles });
    },
    
	async listRole(req, res) {
		const { roleId } = req.params;

		const role = await Role.findByPk(roleId);
		
		if (!role)
			return res.status(404).json({ error: "Role not found!" });

		return res.status(200).json({ role });
    },
    
    async listRoleByName(req, res) {
		const { name } = req.params;

        name = name.toUpperCase();

		const role = await Role.findOne({ where: { name } });
		
		if (!role)
			return res.status(404).json({ error: "Role not found!" });

		return res.status(200).json({ role });
	},
    
	async verifyName(req, res) {
		const { name } = req.params;

        name = name.toUpperCase();

		if (name) {
			const role = await Role.findOne({ where: { name } });
			
			if (role)
                return res.status(200).json({ nameExists: true });

			return res.status(200).json({ nameExists: false });
		}

		return res.status(400).json({ error: "Name to verify it can't be empty!" });
	},

	async create(req, res) {
		const { name } = req.body;

        name = name.toUpperCase();
        
        const nameExists = await Role.findOne({ where: { name } });

        if (nameExists)
            return res.status(400).json({ error: "Name already exists!" });

		const role = await Role.create({ name });

		return res.status(201).json({ role });
    },
    
    async update(req, res) {
        const { roleId } = req.params;
        const { name } = req.body;

        name = name.toUpperCase();
        
        const role = await Role.findByPk(roleId);
        const nameExists = await Role.findOne({ where: { name } });

        if (!role)
            return res.status(400).json({ error: "Role not found!" });

        if (nameExists)
            return res.status(400).json({ error: "Name is already being used!" });

        role.name = name;
        
        await role.save();

		return res.status(200).json({ role });
    },
    
    async delete(req, res) {
        const { roleId } = req.params;
        
        const role = await Role.findByPk(roleId);

        if (!role)
            return res.status(404).json({ error : "Role not found!" });
        
        await role.destroy();

		return res.status(204).json();
	},
}