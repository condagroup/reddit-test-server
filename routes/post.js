var express = require("express");
const PostsController = require("../controllers/PostsController");

var router = express.Router();

router.get("/load", PostsController.load);
router.post("/show", PostsController.show);
router.get("/list", PostsController.list);
router.get("/listByCategory", PostsController.listByCategory);
router.get("/listByUser", PostsController.listByUser);
router.post("/create", PostsController.create);

module.exports = router;