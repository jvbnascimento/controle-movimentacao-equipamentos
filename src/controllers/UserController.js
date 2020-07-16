const User = require('../models/User');

module.exports = {
	async listAllUsers(req, res) {
		const users = await User.findAll();

		return res.json({ users });
    },
    
    async listUser(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);
        
        if (!user) {
            return res.status(404).send('User not found!');
        }

		return res.json({ user });
	},

	async create(req, res) {
		const { name, email, password } = req.body;

		const user = await User.create({ name, email, password });

		return res.json({ user });
	},
}