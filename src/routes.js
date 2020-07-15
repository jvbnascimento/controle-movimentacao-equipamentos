const express = require("express");

const routes = express.Router();

const UserController = require("./controllers/UserController");
const TypeController = require("./controllers/TypeController");
const DepartmentController = require("./controllers/DepartmentController");
const HardwareController = require("./controllers/HardwareController");
const MovementController = require("./controllers/MovementController");

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);

routes.get("/types", TypeController.index);
routes.post("/types", TypeController.store);

routes.get("/departments", DepartmentController.index);
routes.post("/departments", DepartmentController.store);

routes.get("/hardwares", HardwareController.index);
routes.post("/:type_id/hardwares", HardwareController.store);

routes.get("/movements", MovementController.index);
routes.post("/movements", MovementController.store);

module.exports = routes;