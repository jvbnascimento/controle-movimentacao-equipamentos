const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const xlsxFile = require('read-excel-file/node');

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

// connection.sync({ force: true })
// 	.then(async () => {
// 		const admnRole = await Role.create({
// 			name: "ADMINISTRADOR"
// 		});
// 		const mngrRole = await Role.create({
// 			name: "GERENTE"
// 		});
// 		const userRole = await Role.create({
// 			name: "USUÁRIO"
// 		});

// 		await User.create({
// 			name: 'admin',
// 			email: 'admin@email.com',
// 			password: 'admin@123',
// 		}).then((user) => {
// 			user.addRole(admnRole)
// 			user.addRole(mngrRole)
// 			user.addRole(userRole)
// 		});

// 		await Type.create({
// 			name: "BACKUP"
// 		});
// 		await Type.create({
// 			name: "COMPUTADOR DE MESA"
// 		});
// 		await Type.create({
// 			name: "COMPUTADOR PORTÁTIL"
// 		});
// 		await Type.create({
// 			name: "ENERGIA"
// 		});
// 		await Type.create({
// 			name: "IDENTIFICAÇÃO"
// 		});
// 		await Type.create({
// 			name: "IMPRESSÃO"
// 		});
// 		await Type.create({
// 			name: "MONITOR"
// 		});
// 		await Type.create({
// 			name: "QUADRO BRANCO"
// 		});
// 		await Type.create({
// 			name: "RACK"
// 		});
// 		await Type.create({
// 			name: "REDE"
// 		});
// 		await Type.create({
// 			name: "SUPORTE DE PAREDE"
// 		});

// 		await Department.create({
// 			name: "ASCOM",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "ASPLAN",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "ASTEC",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/CEGEA",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/CEGEF",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/CEGEPE",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/COPA E ZELADORIA",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/FRIFORT",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/MALOTE",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/PROTOCOLO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/RECEPCAO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COAFI/TRANSPORTE",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEC",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEC/ARQUIVO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEC/CSA",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEM",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEPAT",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEPAT/CEIMOV",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGEPAT/CEMOVA",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP/CECORH",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP/CEDRH",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP/CEFOP",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP/CESUPE",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COGESP/CPCCS",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COJUR",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COPLAM",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC II",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/CENTRAL",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/CONTAINER",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/DATACENTER",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/DESENVOLVIMENTO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/INFRA",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "COTEC/NOBREAKS",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "GABINETE ADJUNTO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "GABINETE EXECUTIVO",
// 			boss: "TESTE"
// 		});
// 		await Department.create({
// 			name: "GABINETE",
// 			boss: "TESTE"
// 		});

// 		xlsxFile('../CONTROLE PARQUE 2020.xlsx', { sheet: 'PARQUE' })
// 			.then((rows) => {
// 				rows.forEach(async (element) => {
// 					let type = '';
// 					let department = ''

// 					if (element[1]) {
// 						type = await Type.findOne({
// 							where: {
// 								name: element[1]
// 							}
// 						});
// 					}
// 					if (element[7]) {
// 						const departmentName = element[7] === 'COTEC/INFRA/ANEXO' ? 'COTEC/INFRA' : element[7];

// 						department = await Department.findOne({
// 							where: {
// 								name: departmentName
// 							}
// 						});
// 					}

// 					if (type && department) {
// 						Hardware.create({
// 							code: element[0],
// 							type_id: type.id,
// 							description: element[2],
// 							warranty: element[4] === null ? new Date().toLocaleDateString() : element[4],
// 							has_office: element[5] === null ? 'SEM OFFICE' : element[5],
// 							department_id: department.id,
// 							brand: 'MARCA',
// 							auction: false,
// 							date_auction: null
// 						});
// 					}
// 				});
// 			});
// 	});

module.exports = connection;