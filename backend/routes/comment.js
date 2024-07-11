const { createCategory, updateCategory, getAllCategories, deleteCategoryById } = require("../controller/category");
const { createComment, getAllComments, getCommentById,deleteCommentById } = require("../controller/comment");

const router = require("express").Router();

router.post("/api/comment", createComment);
router.get("/api/comment",getAllComments);
router.get("/api/comment/:blogId",getCommentById);
router.post("/api/category",createCategory);

router.put("/api/category",updateCategory)
router.get("/api/category",getAllCategories);
router.delete("/api/category/:catId",deleteCategoryById);
router.delete("/api/comment/:commentId",deleteCommentById);
module.exports = router;