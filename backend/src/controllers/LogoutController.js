const { Op } = require("sequelize");

module.exports = {
	async logout(req, res) {
        localStorage.clear();

		return res.status(201).json();
	},
}