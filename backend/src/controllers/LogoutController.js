const { Op } = require("sequelize");

const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
	async logout(req, res) {
        localStorage.clear();

		return res.status(201).json();
	},
}