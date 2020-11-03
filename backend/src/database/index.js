const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Type = require("../models/Type");
const Department = require("../models/Department");
const Hardware = require("../models/Hardware");
const Movement = require("../models/Movement");
const Role = require("../models/Role");

const connection = new Sequelize(dbConfig);

User.init(connection);
Type.init(connection);
Department.init(connection);
Hardware.init(connection);
Movement.init(connection);
Role.init(connection);

User.associate(connection.models);
Type.associate(connection.models);
Department.associate(connection.models);
Hardware.associate(connection.models);
Movement.associate(connection.models);
Role.associate(connection.models);

module.exports = connection;