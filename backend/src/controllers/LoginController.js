const { Op } = require("sequelize");

const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
	async loginAuth(req, res) {
        const { login, password } = req.body;

		const verifyUser = await User.findOne({
            where: {
                email: {
                    [Op.eq]: `${login}`
                }
            },
            include: {
                association: 'roles',
                through: {
                    attributes: [],
                }
            }
        });

        if (!verifyUser) {
            return res.json({ error: "Email não cadastrado.", status: 404 });
        }

        if (!await bcrypt.compare(password, verifyUser.password)) {
            return res.json({ error: "Senha incorreta!", status: 400 });
        }

        return res.json({ user: verifyUser, status: 200 });
	},
}