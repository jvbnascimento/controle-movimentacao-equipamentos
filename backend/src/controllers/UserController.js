const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');

module.exports = {
	async listAllUsers(req, res) {
		const users = await User.findAll({
            include: {
                association: 'roles',
                through: {
                    attributes: [],
                }
            },
            order: ['id']
        });

		return res.status(200).json({ users });
    },
    
    async listUser(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: {
                association: 'roles',
                through: {
                    attributes: [],
                }
            }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

		return res.status(200).json({ user });
	},

	async create(req, res) {
        const { name, email, password, roles } = req.body;

        const email_exists = await User.findAll({
            where: {
                email
            }
        });
        
        if (email_exists.length != 0) {
            return res.status(400).json({ error: 'Email already exists!' });
        }

		const user = User.create({
            name,
            email,
            password
        }).then(async (user) => {
            roles.map(async (element) => {
                const role = await Role.findByPk(element.id);

                if (role) {
					await user.addRole(role);
                }
            });

            return user;
        });

		return res.status(201).json({ user });
    },

    async update(req, res) {
        const { user_id } = req.params;
        const { name, email, roles } = req.body;

        const email_exists = await User.findAll({
            where: {
                email
            }
        });

        if (email_exists.length != 0 && email_exists[0].email != user.email) {
            return res.status(400).json({ error: 'Email is already being used!' });
        }

        const user = await User.findByPk(user_id, {
            include: {
                association: 'roles'
            }
        }).then(user => {
            user.setRoles([]);

            roles.map(async (role) => {
                const new_role = await Role.findByPk(role.id);
                await user.addRole(new_role);
            });

            return user;
        });

        if (await !user) {
            return res.status(400).json({ error: 'User not found!' });
        }

        user.name = name;
        user.email = email;

        await user.save();

        return res.status(200).json({ user });
    },
    
    async updatePassword(req, res) {
        const { user_id } = req.params;
        const { password, new_password, confirmed_new_password } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.json({ error: 'User not found!', status: 404 });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.json({ error: 'Previous password is different from the current password!', status: 400 });
        }
        if (new_password != confirmed_new_password) {
            return res.json({ error: 'New password is different from confirmation!', status: 400 });
        }

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(new_password, salt);

        await user.save();

        return res.json({ user, status: 200 });
	},
    
    async delete(req, res) {
		const { user_id } = req.params;

        const user = await User.findByPk(user_id);
        
        if (!user) {
            return res.json({ error: 'User not found!', status: 404 });
        }

        await user.destroy();

        return res.status(204).json();
	},
}