const Type = require('../models/Type');

module.exports = {
	async listAllTypes(req, res) {
		const types = await Type.findAll();

		return res.status(200).json({ types });
    },
    
	async listType(req, res) {
		const { type_id } = req.params;

		const type = await Type.findByPk(type_id);
		
		if (!type) {
			return res.status(404).json({ error: 'Type not found!' });
		}

		return res.status(200).json({ type });
    },
    
    async listTypeByName(req, res) {
		const { name } = req.params;

		const type = await Type.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
		
		if (!type) {
			return res.status(404).json({ error: 'Type not found!' });
		}

		return res.status(200).json({ type });
	},
    
	async nameExists(req, res) {
		const { name } = req.params;

		if (name !== null) {
			const type = await Type.findOne({
				where: {
					name: name.toUpperCase()
				}
            });
			
			if (type && type.name) {
                return res.status(200).json({ name_exists: true });
            }

			return res.status(200).json({ name_exists: false });
		}

		return res.status(200).json({ name_exists: false });
	},

	async create(req, res) {
		const { name } = req.body;
        
        const name_exists = await Type.findAll({
            where: { name: name.toUpperCase() } 
        });

        if (name_exists.length != 0) {
            return res.status(404).json({ error: 'Name already exists!' });
        }

		const type = await Type.create({ name: name.toUpperCase() });

		return res.status(201).json({ type });
    },
    
    async update(req, res) {
        const { type_id } = req.params;
        const { name } = req.body;
        
        const type = await Type.findByPk(type_id);
        const name_exists = await Type.findAll({
            where: { name: name.toUpperCase() } 
        });

        if (!type) {
            return res.status(404).json({ error: 'Type not found!' });
        }
        if (name_exists.length != 0) {
            return res.status(400).json({ error: 'Name is already being used!' });
        }

        type.name = name.toUpperCase();
        
        await type.save();

		return res.status(200).json({ type });
    },
    
    async delete(req, res) {
        const { type_id } = req.params;
        
        const type = await Type.findByPk(type_id);

        if (!type) {
            return res.status(404).json({ error : 'Type not found!' });
        }
        
        await type.destroy();

		return res.status(204).json();
	},
}