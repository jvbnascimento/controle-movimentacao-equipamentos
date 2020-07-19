const express = require("express");

const routes = express.Router();

const UserController = require("./controllers/UserController");
const TypeController = require("./controllers/TypeController");
const DepartmentController = require("./controllers/DepartmentController");
const HardwareController = require("./controllers/HardwareController");
const MovementController = require("./controllers/MovementController");

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
routes.get("/hardwares/name/:description", HardwareController.listAllHardwaresByName);
routes.get("/hardwares/category/:name_category", HardwareController.listAllHardwaresByCategory);
routes.get("/hardwares/:hardware_id", HardwareController.listHardware);
routes.post("/:type_id/hardwares", HardwareController.create);
routes.put("/hardwares/:hardware_id", HardwareController.update);
routes.delete("/hardwares/:hardware_id", HardwareController.delete);

routes.get("/movements", MovementController.index);
routes.post("/movements", MovementController.store);

module.exports = routes;