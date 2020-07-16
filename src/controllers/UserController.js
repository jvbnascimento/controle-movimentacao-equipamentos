const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');

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

        const email_exists = await User.findAll({
            where: {
                email
            }
        });
        
        if (email_exists) {
            return res.status(400).send('Email already exists!');
        }

		const user = await User.create({ name, email, password });

		return res.json({ user });
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
            return res.status(404).send('User not found!');
        }
        if (email_exists.length != 0 && email_exists[0].email != email) {
            return res.status(400).send('Email is already being used!');
        }
        
        user.name = name;
        user.email = email;

        await user.save();

        return res.json({ user });
    },
    
    async updatePassword(req, res) {
        const { user_id } = req.params;
        const { password, new_password, confirmed_new_password } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).send('User not found!');
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Previous password is different from the current password!');
        }
        if (new_password != confirmed_new_password) {
            return res.status(400).send('New password is different from confirmation!');
        }

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(new_password, salt);

        await user.save();

        return res.json({ user });
	},
    
    async delete(req, res) {
		const { user_id } = req.params;

        const user = await User.findByPk(user_id);
        
        if (!user) {
            return res.status(404).send('User not found!');
        }

        await user.destroy();

        return res.status(204).json();
	},
}