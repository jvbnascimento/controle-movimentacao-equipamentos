const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");

module.exports = {
    async listAllUsers(req, res) {
        const users = await User.findAll({
            include: {
                association: "roles",
                through: { attributes: [] }
            },
            order: ["id"]
        });

        return res.status(200).json({ users });
    },

    async listUser(req, res) {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            include: {
                association: "roles",
                through: { attributes: [] }
            }
        });

        if (!user)
            return res.status(404).json({ error: "User not found!" });

        return res.status(200).json({ user });
    },

    async create(req, res) {
        const { name, email, password, roles } = req.body;

        const emailExists = await User.findOne({ where: { email } });

        if (emailExists)
            return res.status(400).json({ error: "Email already exists!" });

        User.create({
            name, email, password
        }).then(user => {
            roles.map(async (element) => {
                const role = await Role.findByPk(element.id);

                if (role) await user.addRole(role);
            });

            return res.status(201).json({ user });
        }).catch((err) => {
            return res.status(400).json({ error: err });
        })

    },

    async update(req, res) {
        const { userId } = req.params;
        const { name, email, roles } = req.body;

        const user = await User.findByPk(userId, {
            include: { association: "roles" }
        });

        if (!user)
            return res.status(404).json({ error: "User not found!" });

        const emailExists = await User.findOne({ where: { email } });

        if (emailExists && emailExists.email != user.email)
            return res.status(400).json({ error: "Email is already being used!" });

        await user.setRoles([]);

        roles.map(async (role) => {
            const newRole = await Role.findByPk(role.id);

            if (newRole) await user.addRole(newRole);
        });

        user.name = name;
        user.email = email;

        await user.save();

        return res.status(200).json({ user });
    },

    async updatePassword(req, res) {
        const { userId } = req.params;
        const { password, newPassword, confirmedNewPassword } = req.body;

        const user = await User.findByPk(userId);

        if (!user)
            return res.status(404).json({ error: "User not found!" });

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).json({ error: "Previous password is different from the current password!" });

        if (newPassword != confirmedNewPassword)
            return res.status(400).json({ error: "New password is different from confirmation!" });

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(newPassword, salt);

        await user.save();

        return res.status(200).json({ user });
    },

    async delete(req, res) {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user)
            return res.status(404).json({ error: "User not found!" });

        await user.destroy();

        return res.status(204).json();
    },
}