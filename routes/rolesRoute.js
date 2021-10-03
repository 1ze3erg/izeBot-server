const express = require("express");
const { getAllRole, createRole, updateRole, deleteRole } = require("../controllers/rolesController");
const router = express.Router();

router.get("/", getAllRole);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
