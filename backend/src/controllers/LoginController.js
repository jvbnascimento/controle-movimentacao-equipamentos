const { Op } = require("sequelize");

const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
	async loginAuth(req, res) {
        const { user } = req.params;
        const { login, password }  = JSON.parse(user);

		const verifyUser = await User.findOne({
            where: {
                email: {
                    [Op.eq]: `${login}`
                }
            }
        });

        if (!verifyUser) {
            return res.status(404).json({ error: "Email doesn't exist!" });
        }

        if (!await bcrypt.compare(password, verifyUser.password)) {
            return res.status(400).json({ error: "Password is wrong!" });
        }

		return res.status(200).json(verifyUser);
	},
}