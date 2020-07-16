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

routes.get("/departments", DepartmentController.index);
routes.post("/departments", DepartmentController.store);

routes.get("/hardwares", HardwareController.index);
routes.post("/:type_id/hardwares", HardwareController.store);

routes.get("/movements", MovementController.index);
routes.post("/movements", MovementController.store);

module.exports = routes;