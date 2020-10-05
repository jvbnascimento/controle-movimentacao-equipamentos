const express = require("express");

const routes = express.Router();

const UserController = require("./controllers/UserController");
const TypeController = require("./controllers/TypeController");
const DepartmentController = require("./controllers/DepartmentController");
const HardwareController = require("./controllers/HardwareController");
const MovementController = require("./controllers/MovementController");
const LoginController = require("./controllers/LoginController");
const LogoutController = require("./controllers/LogoutController");

routes.get("/users", UserController.listAllUsers);
routes.get("/users/:user_id", UserController.listUser);
routes.post("/users", UserController.create);
routes.put("/users/:user_id", UserController.update);
routes.put("/users/:user_id/password", UserController.updatePassword);
routes.delete("/users/:user_id", UserController.delete);

routes.get("/types", TypeController.listAllTypes);
routes.get("/types/:type_id", TypeController.listType);
routes.post("/types", TypeController.create);
routes.put("/types/:type_id", TypeController.update);
routes.delete("/types/:type_id", TypeController.delete);

routes.get("/departments", DepartmentController.listAllDepartments);
routes.get("/departments/:department_id", DepartmentController.listDepartment);
routes.post("/departments", DepartmentController.create);
routes.put("/departments/:department_id", DepartmentController.update);
routes.delete("/departments/:department_id", DepartmentController.delete);

routes.get("/hardwares/detailed", HardwareController.listAllDetailedHardwares);
routes.get("/hardwares", HardwareController.listAllHardwares);
routes.get("/hardwares/description/:description", HardwareController.listAllHardwaresByDescription);
routes.get("/hardwares/category/:name_category", HardwareController.listAllHardwaresByCategory);
routes.get("/hardwares/heritage/:heritage", HardwareController.listHardwareByHeritage);
routes.get("/hardwares/department/:department_id", HardwareController.listHardwareByDepartment);
routes.get("/hardwares/department/:department_name/:limit/:offset", HardwareController.listHardwareByDepartmentName);
routes.get("/hardwares/:hardware_id", HardwareController.listHardwareById);
routes.post("/:type_id/hardwares", HardwareController.create);
routes.put("/hardwares/:hardware_id", HardwareController.update);
routes.delete("/hardwares/:hardware_id", HardwareController.delete);

routes.get("/movements/:movement_id", MovementController.listMovementById);
routes.get("/movements/detailed/:limit/:offset", MovementController.listAllMovements);
routes.get("/movements/data/:date_movement", MovementController.listAllMovementsByData);
routes.get("/movements/heritage/:heritage", MovementController.listAllMovementsByHeritage);
routes.get("/movements/:limit/:offset/filters", MovementController.listAllMovementsByAdvancedSearch);
routes.post("/movements", MovementController.create);
routes.put("/movements/:movement_id", MovementController.update);
routes.delete("/movements/:movement_id", MovementController.delete);

routes.post("/login/verify/:user", LoginController.loginAuth);

module.exports = routes;