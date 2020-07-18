const Type = require('../models/Type');

module.exports = {
	async listAllTypes(req, res) {
		const types = await Type.findAll();

		return res.json({ types });
    },
    
	async listType(req, res) {
		const { type_id } = req.params;

		const type = await Type.findByPk(type_id);
		
		if (!type) {
			return res.status(404).send('Type not found!');
		}

		return res.json({ type });
	},

	async create(req, res) {
        const { name } = req.body;
        
        const name_exists = await Type.findAll({
            where: { name } 
        });

        if (name_exists.length != 0) {
            return res.status(400).send('Name already exists!');
        }

		const type = await Type.create({ name });

		return res.status(201).json({ type });
    },
    
    async update(req, res) {
        const { type_id } = req.params;
        const { name } = req.body;
        
        const type = await Type.findByPk(type_id);
        const name_exists = await Type.findAll({
            where: { name } 
        });

        if (!type) {
            return res.status(404).send('Type not found!');
        }
        if (name_exists.length != 0) {
            return res.status(400).send('Name is already being used!');
        }

        type.name = name;
        
        await type.save();

		return res.json({ type });
    },
    
    async delete(req, res) {
        const { type_id } = req.params;
        
        const type = await Type.findByPk(type_id);

        if (!type) {
            return res.status(404).send('Type not found!');
        }
        
        await type.destroy();

		return res.status(204).json();
	},
}