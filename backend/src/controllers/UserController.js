const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');

module.exports = {
	async listAllUsers(req, res) {
		const users = await User.findAll({
            include: {
                association: 'roles',
                through: {
                    attributes: [],
                }
            }
        });

		return res.json({ users, status: 200 });
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
            return res.json({ error: 'User not found!', status: 404 });
        }

		return res.json({ user, status: 200 });
	},

	async create(req, res) {
        const { name, email, password, roles } = req.body;

        const email_exists = await User.findAll({
            where: {
                email
            }
        });
        
        if (email_exists.length != 0) {
            return res.json({ error: 'Email already exists!', status: 404 });
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
        });

		return res.json({ user, status: 201 });
    },

    async update(req, res) {
        const { user_id } = req.params;
        const { name, email } = req.body;

        const user = await User.findByPk(user_id);
        const email_exists = await User.findAll({
            where: {
                email
            }
        });

        if (!user) {
            return res.json({ error: 'User not found!', status: 404 });
        }
        if (email_exists.length != 0 && email_exists[0].email != user.email) {
            return res.json({ error: 'Email is already being used!', status: 400 });
        }
        
        user.name = name;
        user.email = email;

        await user.save();

        return res.json({ user, status: 200 });
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

        return res.json({ status: 204 });
	},
}