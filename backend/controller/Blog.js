const blogData = require("../models/blog");
const { isAdminUser } = require("../utils/adminUser");
const { createSuccessResponse, createErrorResponse } = require("../utils/responseHelper");


exports.createBlog = async (req, res) => {
    const { userId, userName, title, description,image,categoryId,categoryName, subTitle } = req.body;
    console.log(subTitle)
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User Id Required !" })
    }
       const created_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
       const updated_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const blogResp = await blogData.create({
            userId, userName, title, description,categoryId,categoryName,image,created_at,updated_at, subTitle
        });

        if(blogResp){
            console.log(blogResp);
            res.send(createSuccessResponse(blogResp));
        }
        else {
            res.send(createErrorResponse());
        }
} 

exports.updateBlog = async (req, res) => {
    const { userId, userName, title, description,categoryId,categoryName,created_at,image, blogId, subTitle } = req.body;
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!userId) {
        return res
            .status(400)
            .json({ message: "User Id Required !" })
    }
       const updated_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const blogResp = await blogData.updateOne({_id:blogId},{
            userId, userName, title, description,image,categoryId,categoryName,created_at,updated_at, subTitle
        });
        // const blogResp = await blogData.updateOne({_id:blogId},{

        if(blogResp.acknowledged){
            console.log(blogResp);
            res.send(createSuccessResponse(req.body));
        }
        else {
            res.send(createErrorResponse());
        }
} 

exports.getAllBlogs = async (req, res) => {
    try {
        let order = req.query.sortOrder === "asc" ? 1 : -1;
        let query = req.query.categoryId ? { categoryId: req.query.categoryId } : {};

        let blogResp = await blogData.find(query).sort({ created_at:-1 });

        if (blogResp && blogResp.length > 0) {
            res.send(createSuccessResponse(blogResp));
        } else {
            res.send(createErrorResponse("No blogs found"));
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send(createErrorResponse("Internal Server Error"));
    }
};


exports.getBlogById = async (req, res) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res
            .status(400)
            .json({ message: "blog Id Required !" })
    }

    const blogResp = await blogData.findById({_id:blogId
    });

    if(blogResp){
        console.log(blogResp);
        res.send(createSuccessResponse(blogResp));
    }
    else {
        res.send(createErrorResponse());
    }
} 

exports.getBlogByTitle = async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res
            .status(400)
            .json({ message: "ttile Required !" })
    }

    const regex = new RegExp(title, "i"); // "i" flag for case-insensitive search
    try {
        const blogResp = await blogData.find({ title: { $regex: regex } });
        if (blogResp.length > 0) {
            console.log(blogResp);
            res.send(createSuccessResponse(blogResp));
        } else {
            res.send(createErrorResponse());
        }
    } catch (error) {
        console.error('Error fetching blogs by title:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
} 


exports.deleteBlogById = async (req, res) => {
    const { blogId } = req.params;
    if (!blogId) {
        return res
            .status(400)
            .json({ message: "blog Id Required !" })
    }
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const blogResp = await blogData.deleteOne({_id:blogId
    });

    if(blogResp){
        console.log(blogResp);
        res.send(createSuccessResponse(blogResp));
    }
    else {
        res.send(createErrorResponse());
    }
} 