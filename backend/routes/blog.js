const { createBlog, updateBlog, getAllBlogs, getBlogById, deleteBlogById, getBlogByTitle } = require("../controller/Blog");

const router = require("express").Router();

router.post("/api/blog", createBlog);
router.put("/api/blog",updateBlog);
router.get("/api/blog",getAllBlogs);
router.get("/api/blog/:blogId",getBlogById);
router.delete("/api/blog/:blogId",deleteBlogById);
router.get("/api/blog-title",getBlogByTitle);


module.exports = router;