const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const xlsxFile = require('read-excel-file/node');

const User = require("../models/User");
const Type = require("../models/Type");
const Department = require("../models/Department");
const Hardware = require("../models/Hardware");
const Role = require("../models/Role");
const PublicAgency = require("../models/PublicAgency");
const TypeMovement = require("../models/TypeMovement");
const Movement = require("../models/Movement");

const connection = new Sequelize(dbConfig);

User.init(connection);
Type.init(connection);
Department.init(connection);
Hardware.init(connection);
Role.init(connection);
TypeMovement.init(connection);
PublicAgency.init(connection);
Movement.init(connection);

User.associate(connection.models);
Type.associate(connection.models);
Department.associate(connection.models);
Hardware.associate(connection.models);
Role.associate(connection.models);
PublicAgency.associate(connection.models);
TypeMovement.associate(connection.models);
Movement.associate(connection.models);

// connection.sync({ force: true })
//     .then(async () => {
//         const admnRole = await Role.create({
//             name: "ADMINISTRADOR"
//         });
//         const mngrRole = await Role.create({
//             name: "GERENTE"
//         });

//         await User.create({
//             name: 'Administrador',
//             email: 'suporte.sepog@sepog.fortaleza.ce.gov.br',
//             password: 'admin@123',
//         }).then((user) => {
//             user.addRole(admnRole)
//             user.addRole(mngrRole)
//         });

//         await Type.create({
//             name: "BACKUP"
//         });
//         await Type.create({
//             name: "COMPUTADOR DE MESA"
//         });
//         await Type.create({
//             name: "COMPUTADOR PORTÁTIL"
//         });
//         await Type.create({
//             name: "ENERGIA"
//         });
//         await Type.create({
//             name: "IDENTIFICAÇÃO"
//         });
//         await Type.create({
//             name: "IMPRESSÃO"
//         });
//         await Type.create({
//             name: "IMAGEM"
//         });
//         await Type.create({
//             name: "QUADRO BRANCO"
//         });
//         await Type.create({
//             name: "RACK"
//         });
//         await Type.create({
//             name: "REDE"
//         });
//         await Type.create({
//             name: "SUPORTE DE PAREDE"
//         });

//         await Department.create({
//             acronym: "ASCOM",
//             name: "ASSESSORIA DE COMUNICACAO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "ASPLAN",
//             name: "ASSESSORIA DE PLANEJAMENTO E DESENVOLVIMENTO INSTITUCIONAL",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "ASTEC",
//             name: "ASSESSORIA TECNICA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI",
//             name: "COORDENADORIA ADMINISTRATIVO FINANCEIRA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/CEGEA",
//             name: "CELULA DE GESTAO ADMINISTRATIVA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/CEGEF",
//             name: "CELULA DE GESTAO FINANCEIRA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/CEGEPE",
//             name: "CELULA DE GESTAO DE PESSOAS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/COPA E ZELADORIA",
//             name: "COPA E ZELADORIA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/FRIFORT",
//             name: "ASCOM",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/MALOTE",
//             name: "MALOTE",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/PROTOCOLO",
//             name: "PROTOCOLO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/RECEPCAO",
//             name: "RECEPÇÃO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COAFI/TRANSPORTE",
//             name: "TRANSPORTE",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEC",
//             name: "COORDENADORIA DE GESTAO DE AQUISICOES CORPORATIVAS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEC/ARQUIVO",
//             name: "ARQUIVO CENTRAL",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEC/CSA",
//             name: "CONTROLE DE SISTEMA DE ABASTECIMENTO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEM",
//             name: "COORDENADORIA DE GESTAO E MODERNIZACAO ORGANIZACIONAL",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEPAT",
//             name: "COORDENADORIA DE GESTAO DO PATRIMONIO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEPAT/CEIMOV",
//             name: "CELULA DE GESTÃO DE BENS IMÓVEIS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGEPAT/CEMOVA",
//             name: "CELULA DE GESTÃO DE BENS MÓVEIS E ALMOXARIFADO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP",
//             name: "COORDENADORIA DE GESTAO ESTRATEGICA DE PESSOAS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP/CECORH",
//             name: "CELULA DE GESTAO DE CONTROLE DE RECURSOS HUMANOS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP/CEDRH",
//             name: "CELULA DE GESTAO DE DESENVOLVIMENTO DE RECURSOS HUMANOS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP/CEFOP",
//             name: "CELULA DE GESTAO DA FOLHA DE PAGAMENTO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP/CESUPE",
//             name: "CELULA DE GESTAO DE SUPRIMENTO DE PESSOAL",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COGESP/CEPCCS",
//             name: "CELULA DE GESTAO DOS PLANOS DE CARGOS, CARREIRAS E SALARIOS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COJUR",
//             name: "COORDENADORIA JURIDICA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COPLAM",
//             name: "COORDENADORIA DE PLANEJAMENTO, ORCAMENTO E MONITORAMENTO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC",
//             name: "COORDENADORIA DE TECNOLOGIA DA INFORMACAO E COMUNICACAO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/CENTRAL",
//             name: "CELULA DE CENTRAL DE SUPORTE",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/COTEC II",
//             name: "DESENVOLVIMENTO DO NOVO RH FOLHA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/CONTAINER",
//             name: "DATACENTER DA SEPOG",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/DESENVOLVIMENTO",
//             name: "CELULA DE DESENVOLVIMENTO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/INFRA",
//             name: "CELULA DE INFRAESTRUTURA",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "COTEC/NOBREAKS",
//             name: "SALA DE NOBREAKS",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "GABINETE ADJUNTO",
//             name: "GABINETE DO SECRETARIO ADJUNTO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "GABINETE EXECUTIVO",
//             name: "GABINETE DO SECRETARIO EXECUTIVO",
//             boss: "TESTE"
//         });
//         await Department.create({
//             acronym: "GABINETE",
//             name: "GABINETE DO SECRETARIO TITULAR",
//             boss: "TESTE"
//         });

//         await TypeMovement.create({
//             description: "EMPRÉSTIMO INTERNO"
//         });
//         await TypeMovement.create({
//             description: "EMPRÉSTIMO EXTERNO"
//         });
//         await TypeMovement.create({
//             description: "DVO - INSERVÍVEL"
//         });
//         await TypeMovement.create({
//             description: "TRANSFERÊNCIA/DOAÇÃO"
//         });

        // Movement.sync({ force: true })

        // xlsxFile('../CONTROLE PARQUE 2021.xlsx', { sheet: 'PARQUE' })
        // .then((rows) => {
        // 	rows.forEach(async (element) => {
        // 		let type = '';
        // 		let department = ''

        // 		if (element[1]) {
        // 			type = await Type.findOne({
        // 				where: {
        // 					name: element[1] === "MONITOR" ? "IMAGEM" : element[1]
        // 				}
        // 			});
        // 		}
        // 		if (element[7]) {
        // 			let departmentName = '';
        // 			if (element[7] === 'COTEC/INFRA/ANEXO') {
        // 				departmentName = 'COTEC/INFRA';
        // 			}
        //             else if (element[7] === 'COTEC II') {
        // 				departmentName = 'COTEC/COTEC II';
        // 			}
        //             else if (element[7] === 'COGESP/CPCCS') {
        // 				departmentName = 'COGESP/CEPCCS';
        // 			}
        // 			else if (element[7] === 'GAB. ADJUNTO') {
        // 				departmentName = 'GABINETE ADJUNTO';
        // 			}
        // 			else if (element[7] === 'GAB.EXECUTIVO') {
        // 				departmentName = 'GABINETE EXECUTIVO';
        // 			}
        // 			else if (element[7] === 'COTEC/DESENVOLV') {
        // 				departmentName = 'COTEC/DESENVOLVIMENTO';
        // 			}
        // 			else if (element[7] === 'COAFI/COPA E SELADORIA') {
        // 				departmentName = 'COAFI/COPA E ZELADORIA';
        // 			}
        // 			else {
        // 				departmentName = element[7];
        // 			}

        // 			department = await Department.findOne({
        // 				where: {
        // 					acronym: departmentName
        // 				}
        // 			});
        // 		}

        // 		if (type && department) {
        // 			Hardware.create({
        // 				code: element[0],
        // 				type_id: type.id,
        // 				description: element[2],
        // 				warranty: element[4] === null ? new Date().toLocaleDateString() : element[4],
        // 				has_office: element[5] === null ? 'SEM OFFICE' : element[5],
        // 				department_id: department.id,
        // 				brand: 'MARCA',
        // 			});
        // 		}
        // 	});
        // })
        // .then(async (rows) => {
        //     await rows.forEach(async (element) => {
        //         let startIndex = 7;

        //         while (element[startIndex] !== null && element[startIndex] !== undefined) {
        //             if (element[startIndex + 1] !== null && element[startIndex + 1] !== undefined) {
        //                 let departmentOriginName = '';
        //                 let departmentDestinationName = '';

        //                 if (element[startIndex] === 'COTEC/INFRA/ANEXO') {
        //                     departmentOriginName = 'COTEC/INFRA';
        //                 }
        //                 else if (element[startIndex] === 'COTEC II') {
        //                     departmentOriginName = 'COTEC/COTEC II';
        //                 }
        //                 else if (element[startIndex] === 'COGESP/CPCCS') {
        //                     departmentOriginName = 'COGESP/CEPCCS';
        //                 }
        //                 else if (element[startIndex] === 'GAB. ADJUNTO') {
        //                     departmentOriginName = 'GABINETE ADJUNTO';
        //                 }
        //                 else if (element[startIndex] === 'GAB.EXECUTIVO') {
        //                     departmentOriginName = 'GABINETE EXECUTIVO';
        //                 }
        //                 else if (element[startIndex] === 'COTEC/DESENVOLV') {
        //                     departmentOriginName = 'COTEC/DESENVOLVIMENTO';
        //                 }
        //                 else if (element[startIndex] === 'COAFI/COPA E SELADORIA') {
        //                     departmentOriginName = 'COAFI/COPA E ZELADORIA';
        //                 }
        //                 else {
        //                     departmentOriginName = element[startIndex];
        //                 }

        //                 if (element[startIndex + 1] === 'COTEC/INFRA/ANEXO') {
        //                     departmentDestinationName = 'COTEC/INFRA';
        //                 }
        //                 else if (element[startIndex + 1] === 'COTEC II') {
        //                     departmentDestinationName = 'COTEC/COTEC II';
        //                 }
        //                 else if (element[startIndex + 1] === 'COGESP/CPCCS') {
        //                     departmentDestinationName = 'COGESP/CEPCCS';
        //                 }
        //                 else if (element[startIndex + 1] === 'GAB. ADJUNTO') {
        //                     departmentDestinationName = 'GABINETE ADJUNTO';
        //                 }
        //                 else if (element[startIndex + 1] === 'GAB.EXECUTIVO') {
        //                     departmentDestinationName = 'GABINETE EXECUTIVO';
        //                 }
        //                 else if (element[startIndex + 1] === 'COTEC/DESENVOLV') {
        //                     departmentDestinationName = 'COTEC/DESENVOLVIMENTO';
        //                 }
        //                 else if (element[startIndex + 1] === 'COAFI/COPA E SELADORIA') {
        //                     departmentDestinationName = 'COAFI/COPA E ZELADORIA';
        //                 }
        //                 else {
        //                     departmentDestinationName = element[startIndex + 1];
        //                 }

        //                 const departmentOrigin = await Department.findOne({
        //                     where: {
        //                         acronym: departmentOriginName
        //                     }
        //                 });

        //                 const departmentDestination = await Department.findOne({
        //                     where: {
        //                         acronym: departmentDestinationName
        //                     }
        //                 });

        //                 if (await departmentOrigin && await departmentDestination) {
        //                     await Movement.create({
        //                         date_movement: new Date().toLocaleDateString(),
        //                         origin_department_id: departmentOrigin.id,
        //                         destination_department_id: departmentDestination.id,
        //                         public_agent_id: null,
        //                         responsible_id: 1
        //                     }).then(async (movement) => {
        //                         const type = await Type.findOne({
        //                             where: {
        //                                 name: element[1] === "MONITOR" ? "IMAGEM" : element[1]
        //                             }
        //                         });

        //                         const hardware = await Hardware.findOne({
        //                             where: {
        //                                 code: element[0],
        //                                 type_id: type.id,
        //                             }
        //                         });

        //                         if (hardware) {
        //                             hardware.department_id = departmentDestination.id;
        //                             await hardware.save();
        //                             await movement.addHardware(hardware);
        //                         };
        //                     });
        //                 }
        //                 startIndex += 1;
        //             }
        //             else {
        //                 break;
        //             }
        //         }
        //     });
        // });
    // });

module.exports = connection;