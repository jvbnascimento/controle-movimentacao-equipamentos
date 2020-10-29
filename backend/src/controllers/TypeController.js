const Type = require('../models/Type');

module.exports = {
	async listAllTypes(req, res) {
		const types = await Type.findAll();

		return res.json(types);
    },
    
	async listType(req, res) {
		const { type_id } = req.params;

		const type = await Type.findByPk(type_id);
		
		if (!type) {
			return res.status(404).json({ error: 'Type not found!' });
		}

		return res.json(type);
    },
    
    async listTypeByName(req, res) {
		const { name } = req.params;

		const type = await Type.findOne({
            where: {
                name: name.toUpperCase()
            }
        });
		
		if (!type) {
			return res.json({ error: 'Type not found!', status: 404 });
		}

		return res.json({ type, status: 200 });
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
                return res.json({ name_exists: true, stauts: 200 });
            }

			return res.json({ name_exists: false, status: 200 });
		}

		return res.json({ name_exists: false, status: 200 });
	},

	async create(req, res) {
		const { name } = req.body;
        
        const name_exists = await Type.findAll({
            where: { name: name.toUpperCase() } 
        });

        if (name_exists.length != 0) {
            return res.json({ error: 'Name already exists!', status: 404 });
        }

		const type = await Type.create({ name: name.toUpperCase() });

		return res.json({ type, status: 201 });
    },
    
    async update(req, res) {
        const { type_id } = req.params;
        const { name } = req.body;
        
        const type = await Type.findByPk(type_id);
        const name_exists = await Type.findAll({
            where: { name } 
        });

        if (!type) {
            return res.json({ error: 'Type not found!', status: 404 });
        }
        if (name_exists.length != 0) {
            return res.json({ error: 'Name is already being used!', status: 400 });
        }

        type.name = name;
        
        await type.save();

		return res.json({ type, status: 200 });
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