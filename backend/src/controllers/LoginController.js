const { Op } = require("sequelize");

const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
	async loginAuth(req, res) {
        const { login, password } = req.body;

		const verifyUser = await User.findOne({
            where: {
                email: { [Op.eq]: `${login}` }
            },
            include: {
                association: "roles",
                through: { attributes: [] }
            }
        });

        if (!verifyUser)
            return res.status(404).json({ error: "Email not found!" });

        if (!await bcrypt.compare(password, verifyUser.password))
            return res.status(400).json({ error: "Incorrect password" });

        return res.status(200).json({ user: verifyUser });
	},
}