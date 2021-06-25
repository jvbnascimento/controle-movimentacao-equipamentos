const express = require("express");

const routes = express.Router();

const CategoryController = require("./controllers/CategoryController");
const DepartmentController = require("./controllers/DepartmentController");
const HardwareController = require("./controllers/HardwareController");
const LoginController = require("./controllers/LoginController");
const MovementController = require("./controllers/MovementController");
const MovementTypeController = require("./controllers/MovementTypeController");
const PublicAgencyController = require("./controllers/PublicAgencyController");
const RoleController = require("./controllers/RoleController");
const UserController = require("./controllers/UserController");

routes.get("/category", CategoryController.listAllCategories);
routes.get("/category/:categoryId", CategoryController.listCategoryById);
routes.get("/category/name/:name", CategoryController.listCategoryByName);
routes.get("/category/verify/:name", CategoryController.verifyName);
routes.post("/category", CategoryController.create);
routes.put("/category/:categoryId", CategoryController.update);
routes.delete("/category/:categoryId", CategoryController.delete);

routes.get("/movement_types", MovementTypeController.listAllMovementTypes);
routes.get("/movement_types/:movementTypeId", MovementTypeController.listMovementType);
routes.get("/movement_types/description/:description", MovementTypeController.listMovementTypeByDescription);
routes.get("/movement_types/verify_description/:description", MovementTypeController.verifyDescription);
routes.post("/movement_types", MovementTypeController.create);
routes.put("/movement_types/:movementTypeId", MovementTypeController.update);
routes.delete("/movement_types/:movementTypeId", MovementTypeController.delete);

routes.get("/departments", DepartmentController.listAllDepartments);
routes.get("/departments/:departmentId", DepartmentController.listDepartmentById);
routes.get("/departments/name/:departmentName", DepartmentController.listDepartmentByName);
routes.get("/departments/acronym/:departmentAcronym", DepartmentController.listDepartmentByAcronym);
routes.get("/departments/verify_name/:departmentName", DepartmentController.verifyName);
routes.get("/departments/verify_acronym/:departmentAcronym", DepartmentController.verifyAcronym);
routes.post("/departments", DepartmentController.create);
routes.put("/departments/:departmentId", DepartmentController.update);
routes.delete("/departments/:departmentId", DepartmentController.delete);

routes.get("/public_agencies", PublicAgencyController.listAllPublicAgencies);
routes.get("/public_agencies/:publicAgencyId", PublicAgencyController.listPublicAgencyById);
routes.get("/public_agencies/name/:publicAgencyName", PublicAgencyController.listPublicAgencyByName);
routes.get("/public_agencies/acronym/:publicAgencyAcronym", PublicAgencyController.listPublicAgencyByAcronym);
routes.get("/public_agencies/verify_name/:name", PublicAgencyController.verifyName);
routes.get("/public_agencies/verify_acronym/:acronym", PublicAgencyController.verifyAcronym);
routes.post("/public_agencies", PublicAgencyController.create);
routes.put("/public_agencies/:publicAgencyId", PublicAgencyController.update);
routes.delete("/public_agencies/:publicAgencyId", PublicAgencyController.delete);

routes.get("/roles", RoleController.listAllRoles);
routes.get("/roles/:roleId", RoleController.listRole);
routes.get("/roles/name/:name", RoleController.listRoleByName);
routes.get("/roles/verify/:name", RoleController.verifyName);
routes.post("/roles", RoleController.create);
routes.put("/roles/:roleId", RoleController.update);
routes.delete("/roles/:roleId", RoleController.delete);

routes.get("/users", UserController.listAllUsers);
routes.get("/users/:userId", UserController.listUser);
routes.post("/users", UserController.create);
routes.put("/users/:userId", UserController.update);
routes.put("/users/:userId/password", UserController.updatePassword);
routes.delete("/users/:userId", UserController.delete);

routes.get("/hardwares/filters", HardwareController.listAllHardwares);
routes.get("/hardwares/description/:description", HardwareController.listAllHardwaresByDescription);
routes.get("/hardwares/category/:categoryName", HardwareController.listAllHardwaresByCategory);
routes.get("/hardwares/code/:code", HardwareController.listHardwareByCode);
routes.get("/hardwares/department/:departmentId", HardwareController.listHardwareByDepartmentId);
routes.get("/hardwares/public_agency/:publicAgencyId", HardwareController.listHardwareByPublicAgencyId);
routes.get("/hardwares/department/name/:departmentName", HardwareController.listHardwareByDepartmentName);
routes.get("/hardwares/department/acronym/:departmentAcronym/", HardwareController.listHardwareByDepartmentAcronym);
routes.get("/hardwares/public_agency/name/:publicAgencyName/", HardwareController.listHardwareByPublicAgencyName);
routes.get("/hardwares/public_agency/acronym/:publicAgencyAcronym/", HardwareController.listHardwareByPublicAgencyAcronym);
routes.get("/hardwares/:hardwareId", HardwareController.listHardwareById);
routes.post("/:categoryId/hardwares", HardwareController.create);
routes.put("/hardwares/:hardwareId", HardwareController.update);
routes.delete("/hardwares/:hardwareId", HardwareController.delete);

routes.get("/movements", MovementController.listAllMovements);
routes.get("/movements/:movementId", MovementController.listMovementById);
routes.get("/movements/data/:movementDate", MovementController.listAllMovementsByData);
routes.get("/movements/code/:code", MovementController.listAllMovementsByCode);
routes.get("/movements/filters", MovementController.listAllMovementsByAdvancedSearch);
routes.post("/movements", MovementController.create);
routes.put("/movements/:movementId", MovementController.update);
routes.delete("/movements/:movementId", MovementController.delete);

routes.post("/login/verify/", LoginController.loginAuth);

module.exports = routes;