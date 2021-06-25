const { Op } = require("sequelize");

const Category = require("../models/Category");

module.exports = {
	async listAllCategories(req, res) {
		const categories = await Category.findAll();

        if (!categories || categories.length === 0)
            return res.status(404).json({ error: "No category registered" });

		return res.status(200).json({ categories });
    },
    
	async listCategoryById(req, res) {
		const { categoryId } = req.params;

		const category = await Category.findByPk(categoryId);
		
		if (!category) return res.status(404).json({ error: "Category not found!" });

		return res.status(200).json({ category });
    },
    
    async listCategoryByName(req, res) {
		let { name } = req.params;

        name = name.toUpperCase();

		const category = await Category.findOne({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
		
		if (!category) return res.status(404).json({ error: "Category not found!" });

		return res.status(200).json({ category });
	},
    
	async verifyName(req, res) {
		let { name } = req.params;

        name = name.toUpperCase();

		if (name) {
			const category = await Category.findOne({ where: { name } });
			
			if (category && category.name) return res.status(200).json({ nameExists: true });

			return res.status(200).json({ nameExists: false });
		}

		return res.status(400).json({ error: "Name can't be empty!" });
	},

	async create(req, res) {
		let { name } = req.body;

        name = name.toUpperCase();
        
        const nameExists = await Category.findOne({ where: { name } });

        if (nameExists) return res.status(404).json({ error: "Name already exists!" });

		const category = await Category.create({ name });

		return res.status(201).json({ category });
    },
    
    async update(req, res) {
        const { categoryId } = req.params;
        let { name } = req.body;

        name = name.toUpperCase();
        
        const category = await Category.findByPk(categoryId);
        const nameExists = await Category.findAll({ where: { name } });

        if (!category) return res.status(404).json({ error: "Category not found!" });
        
        if (nameExists.length != 0) return res.status(400).json({ error: "Name is already being used!" });

        category.name = name;
        
        await category.save();

		return res.status(200).json({ category });
    },
    
    async delete(req, res) {
        const { categoryId } = req.params;
        
        const category = await Category.findByPk(categoryId);

        if (!category) return res.status(404).json({ error : "Category not found!" });
        
        await category.destroy();

		return res.status(204).json();
	},
}